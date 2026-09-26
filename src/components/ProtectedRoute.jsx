import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Logo className="h-12 opacity-80" />
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Vérification de l'accès...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/connexion" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
