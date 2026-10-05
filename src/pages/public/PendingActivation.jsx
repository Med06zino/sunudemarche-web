import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, RefreshCw, CheckCircle2, Loader2 } from "lucide-react";
import { Button, Alert } from "../../components/ui";
import * as api from "../../api/endpoints";
import logo from "../../assets/logo.png.png";

export default function PendingActivation() {
  const location = useLocation();
  // L'email est passé via navigate state depuis Register
  const email = location.state?.email || "";

  const [resent,   setResent]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleResend() {
    if (!email) return;
    setLoading(true); setError(""); setResent(false);
    try {
      await api.resendActivation(email);
      setResent(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Impossible de renvoyer l'e-mail. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  }

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
            <h1 className="text-xl font-bold text-white">Vérifiez votre e-mail</h1>
            <p className="text-white/65 text-xs mt-1">SunuDémarche</p>
          </div>
        </div>

        {/* Corps */}
        <div className="px-8 py-8 space-y-5">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-primary flex items-center
                            justify-center mx-auto mb-4">
              <Mail size={30} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Compte créé avec succès !</h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Un e-mail d'activation a été envoyé à
              {email && (
                <strong className="text-slate-700 block mt-1">{email}</strong>
              )}
            </p>
            <p className="text-slate-400 text-xs mt-3">
              Cliquez sur le lien dans l'e-mail pour activer votre compte.
              Le lien expire dans <strong>24 heures</strong>.
            </p>
          </div>

          {resent && (
            <Alert variant="success">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} /> E-mail renvoyé avec succès.
              </div>
            </Alert>
          )}
          {error && <Alert variant="error">{error}</Alert>}

          {/* Renvoyer */}
          {email && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleResend}
              disabled={loading}
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Envoi...</>
                : <><RefreshCw size={15} /> Renvoyer l'e-mail d'activation</>
              }
            </Button>
          )}

          <p className="text-xs text-slate-400 text-center pt-2 border-t border-slate-100">
            Déjà activé ?{" "}
            <Link to="/connexion" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
