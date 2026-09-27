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
      toast.success("Connexion réussie !", { duration: 2000 });

      const redirectTo =
        location.state?.from ||
        (user?.role === "AGENT" ? "/agent" : user?.role === "ADMIN" ? "/admin" : "/citoyen");

      // Navigation directe — plus de setTimeout.
      // signIn garantit que loading=false et user≠null avant de retourner,
      // donc ProtectedRoute ne verra jamais un état user=null transitoire.
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.errors?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Email ou mot de passe incorrect.";
      toast.error(msg);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex flex-col items-center justify-center px-4 py-10">

      {/* Retour */}
      <div className="w-full max-w-md mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={13} /> Retour à l'accueil
        </Link>
      </div>

      {/* Carte */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

        {/* En-tête coloré */}
        <div className="bg-gradient-to-br from-primary to-primary-dark px-8 pt-8 pb-10 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img src={logo} alt="SunuDémarche" className="h-10 w-auto object-contain brightness-0 invert" />
            </div>
            <h1 className="text-xl font-bold text-white">Connexion</h1>
            <p className="text-white/65 text-xs mt-1">Accédez à votre espace SunuDémarche</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="vous@exemple.sn"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900
                    placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-600">Mot de passe</label>
                <span className="text-xs text-slate-400 cursor-default select-none" title="Contactez votre administrateur">
                  Mot de passe oublié ?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900
                    placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Connexion...</>
                : <> Se connecter <ArrowRight size={15} /></>
              }
            </Button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6 pt-5 border-t border-slate-100">
            Pas encore de compte ?{" "}
            <Link to="/inscription" className="text-primary font-semibold hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
