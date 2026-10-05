import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydratation du profil 
  const fetchProfile = async () => {
    try {
      const { data } = await api.getProfile();
      setUser(data.data || data);
    } catch {
      // Token invalide ou expiré — nettoyage silencieux
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Au démarrage : si un access_token existe, on charge le profil
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { setLoading(false); return; }
    fetchProfile();
  }, []);

  // Connexion 
  async function signIn(email, password) {
    // loading=true pendant toute la durée → ProtectedRoute affiche le spinner,
    // jamais de user=null transitoire qui déclencherait une redirection.
    setLoading(true);
    try {
      const response   = await api.login({ email, password });
      const payload    = response.data?.data || response.data;

      const accessToken  = payload.access  || payload.access_token;
      const refreshToken = payload.refresh || payload.refresh_token;
      const loggedUser   = payload.user;

      if (accessToken)  localStorage.setItem("access_token",  accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

      if (loggedUser) {
        setUser(loggedUser);
        setLoading(false);
        return loggedUser;
      }

      // Fallback : profil non retourné directement → appel /profile/
      await fetchProfile();
      return null;

    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  // Inscription 
  async function signUp(payload) {
    // L'inscription crée le compte (is_active=True désormais) puis connecte
    await api.register(payload);
    return signIn(payload.email, payload.password);
  }

  // Déconnexion 
  async function signOut() {
    const refresh = localStorage.getItem("refresh_token");

    // Blacklister le refresh token côté serveur (best-effort)
    // On ignore les erreurs 400/401 : le token peut déjà être expiré/blacklisté
    if (refresh) {
      try {
        await api.logout(refresh);
      } catch {
        // Ignoré intentionnellement — nettoyage local toujours effectué
      }
    }

    // Nettoyage local dans tous les cas
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, signIn, signUp, signOut, refreshUser: fetchProfile }}
    >
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
