import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, RefreshCw, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button, Alert } from "../../components/ui";
import * as api from "../../api/endpoints";
import logo from "../../assets/logo.png.png";

export default function ActivateAccount() {
  const { token }  = useParams();
  const navigate   = useNavigate();
  const { setUser } = useAuth();

  const [status, setStatus]   = useState("loading"); // loading | success | error | expired
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setMessage("Lien invalide."); return; }

    api.activateAccount(token)
      .then(({ data }) => {
        // Connexion automatique après activation
        if (data.data?.access) {
          localStorage.setItem("access_token",  data.data.access);
          localStorage.setItem("refresh_token", data.data.refresh);
          if (data.data.user) setUser(data.data.user);
        }
        setStatus("success");
        setMessage(data.message || "Votre compte est activé !");
        // Redirection auto vers l'espace citoyen après 2s
        setTimeout(() => navigate("/citoyen", { replace: true }), 2000);
      })
      .catch((err) => {
        const code = err.response?.data?.code;
        if (code === "token_expired") {
          setStatus("expired");
        } else {
          setStatus("error");
        }
        setMessage(
          err.response?.data?.message ||
          err.response?.data?.detail ||
          "Le lien d'activation est invalide ou déjà utilisé."
        );
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40
                    flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60
                      border border-slate-100 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary-dark px-8 pt-8 pb-10
                        text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center
                            mx-auto mb-4 shadow-lg">
              <img src={logo} alt="SunuDémarche"
                   className="h-10 w-auto object-contain brightness-0 invert" />
            </div>
            <h1 className="text-xl font-bold text-white">Activation du compte</h1>
            <p className="text-white/65 text-xs mt-1">SunuDémarche</p>
          </div>
        </div>

        {/* Corps */}
        <div className="px-8 py-8 text-center space-y-5">

          {status === "loading" && (
            <>
              <Loader2 size={40} className="animate-spin text-primary mx-auto" />
              <p className="text-slate-600 font-medium">Activation en cours…</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Compte activé !</h2>
                <p className="text-slate-500 text-sm mt-1">{message}</p>
                <p className="text-slate-400 text-xs mt-2">
                  Redirection automatique vers votre espace…
                </p>
              </div>
              <Link to="/citoyen">
                <Button size="sm" className="gap-2">Accéder à mon espace</Button>
              </Link>
            </>
          )}

          {status === "expired" && (
            <>
              <RefreshCw size={40} className="text-amber-500 mx-auto" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Lien expiré</h2>
                <p className="text-slate-500 text-sm mt-1">{message}</p>
              </div>
              <Link to="/inscription">
                <Button size="sm" variant="outline">Se réinscrire</Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle size={40} className="text-red-500 mx-auto" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Lien invalide</h2>
                <p className="text-slate-500 text-sm mt-1">{message}</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Link to="/connexion">
                  <Button size="sm" variant="outline">Se connecter</Button>
                </Link>
                <Link to="/inscription">
                  <Button size="sm">S'inscrire</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
