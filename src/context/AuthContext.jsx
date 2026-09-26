import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer le profil de l'utilisateur connecté
  const fetchProfile = async () => {
    try {
      const { data } = await api.getProfile();
      // Adapte selon la structure de ton API (ex: data.data ou directement data)
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

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, []);

  async function signIn(email, password) {
    try {
      const response = await api.login({ email, password });
      const responseData = response.data.data || response.data;
      
      const accessToken = responseData.access || responseData.access_token;
      const refreshToken = responseData.refresh || responseData.refresh_token;
      const loggedUser = responseData.user;

      if (accessToken) localStorage.setItem("access_token", accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

      if (loggedUser) {
        setUser(loggedUser);
      } else {
        await fetchProfile();
      }

      return loggedUser;
    } catch (error) {
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
      if (refresh) await api.logout({ refresh });
    } catch (e) {
      // Best effort, on nettoie quand même le stockage local
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