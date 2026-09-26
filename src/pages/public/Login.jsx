import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png.png";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await signIn(form.email, form.password);
      
      toast.success("Connexion réussie ! Redirection...", {
        duration: 3000,
        style: { background: '#10B981', color: '#fff', borderRadius: '12px' },
      });

      const redirectTo =
        location.state?.from ||
        (user?.role === "AGENT" ? "/agent" : user?.role === "ADMIN" ? "/admin" : "/citoyen");
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 1000);

    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Email ou mot de passe incorrect.";
      
      toast.error(errorMessage, {
        duration: 4000,
        style: { background: '#EF4444', color: '#fff', borderRadius: '12px' },
      });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Bouton de retour global */}
      <div className="w-full max-w-5xl mb-4 flex justify-start">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-primary transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200/80"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la page d'accueil
        </Link>
      </div>

      {/* Conteneur Global (Carte Principale) */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid lg:grid-cols-12 items-stretch">
        
        {/* COLONNE DE GAUCHE : Identique à l'inscription */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50/50 to-white p-8 lg:p-10 flex flex-col justify-between items-center border-r border-slate-100 text-center relative">
          
          <div className="w-full"></div>

          <div className="my-auto py-6 flex flex-col items-center">
            <div className="w-full max-w-[240px] flex items-center justify-center mb-4">
              <img 
                src={logo} 
                alt="SunuDémarche Logo" 
                className="w-full h-auto object-contain drop-shadow-sm" 
              />
            </div>
          </div>

          <div className="w-full pb-2">
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
              Plateforme officielle de gestion des démarches citoyennes
            </p>
          </div>
        </div>

        {/* COLONNE DE DROITE : Le Formulaire de Connexion Pro */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">Connexion</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Accédez à votre espace SunuDémarche.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required 
                  placeholder="mouhamed.niang@email.com"
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Mot de passe avec bouton œil */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Mot de passe</label>
                {/* Optionnel si tu as une route de mot de passe oublié */}
                <span className="text-xs text-slate-400 cursor-default select-none" title="Contactez votre administrateur">
                  Mot de passe oublié ?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Lien vers l'inscription */}
          <p className="text-xs sm:text-sm text-slate-500 text-center mt-6 pt-5 border-t border-slate-100">
            Pas encore de compte ?{" "}
            <Link to="/inscription" className="text-primary font-semibold hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}