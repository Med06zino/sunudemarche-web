import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupère le profil depuis l'API et met à jour le state
  const fetchProfile = async () => {
    try {
      const { data } = await api.getProfile();
      setUser(data.data || data);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Hydratation au démarrage : si un token existe, on charge le profil
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, []);

  async function signIn(email, password) {
    // On repasse loading à true pendant toute la durée de la connexion.
    // ProtectedRoute affichera le spinner — impossible d'avoir un user=null
    // transitoire qui déclencherait une redirection vers /connexion.
    setLoading(true);
    try {
      const response = await api.login({ email, password });
      const responseData = response.data.data || response.data;

      const accessToken = responseData.access || responseData.access_token;
      const refreshToken = responseData.refresh || responseData.refresh_token;
      const loggedUser = responseData.user;

      if (accessToken) localStorage.setItem("access_token", accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

      if (loggedUser) {
        // On met user ET on descend loading en même temps pour garantir
        // que ProtectedRoute ne voit jamais user=null avec loading=false.
        setUser(loggedUser);
        setLoading(false);
        return loggedUser;
      }

      // Fallback : l'API n'a pas retourné l'objet user directement,
      // on le récupère via /profile/ (fetchProfile gère setLoading(false)).
      await fetchProfile();
      return null;
    } catch (error) {
      setLoading(false);
      console.error("Erreur lors de la connexion :", error);
      throw error;
    }
  }

  async function signUp(payload) {
    await api.register(payload);
    return signIn(payload.email, payload.password);
  }

  async function signOut() {
    const refresh = localStorage.getItem("refresh_token");
    try {
      // api.logout attend directement le token string (pas un objet)
      if (refresh) await api.logout(refresh);
    } catch (e) {
      // Best effort — on nettoie le stockage même si le logout API échoue
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signIn, signUp, signOut, refreshUser: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}