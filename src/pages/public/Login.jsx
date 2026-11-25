import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import AuthLayout, {
  AuthHeading,
  FormAlert,
  TextField,
  PasswordField,
  SubmitButton,
} from "../../components/AuthLayout";

const ROLE_HOME = { AGENT: "/agent", ADMIN: "/admin" };
const DEFAULT_HOME = "/citoyen";
const DEFAULT_ERROR = "Email ou mot de passe incorrect.";

const getRedirectPath = (user, from) => from || ROLE_HOME[user?.role] || DEFAULT_HOME;

const getErrorMessage = (err) =>
  err.response?.data?.errors?.non_field_errors?.[0] ||
  err.response?.data?.detail ||
  DEFAULT_ERROR;

/** Centre le contenu et limite sa largeur. */
function Container({ children }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-8 sm:px-6 sm:py-12">
      {children}
    </div>
  );
}

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasError = Boolean(error);

  const updateField = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const user = await signIn(form.email.trim(), form.password);
      toast.success("Connexion réussie !", { duration: 2000 });

      // signIn garantit loading=false et user≠null avant de retourner :
      // ProtectedRoute ne verra jamais un état user=null transitoire.
      navigate(getRedirectPath(user, location.state?.from), { replace: true });
    } catch (err) {
      // 403 = compte non activé → page de renvoi de l'email d'activation
      if (err.response?.status === 403) {
        navigate("/activation-en-attente", { state: { email: form.email } });
        return;
      }

      setError(getErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Container>
        <AuthHeading
          title="Connexion à votre compte"
          subtitle="Bon retour ! Saisissez vos identifiants pour accéder à votre espace."
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {hasError && <FormAlert>{error}</FormAlert>}

          <TextField
            id="login-email"
            name="email"
            type="email"
            label="Adresse email"
            icon={Mail}
            inputMode="email"
            required
            autoFocus
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="vous@exemple.sn"
            value={form.email}
            onChange={updateField("email")}
            invalid={hasError}
          />

          <div>
            <PasswordField
              id="login-password"
              name="password"
              label="Mot de passe"
              required
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              value={form.password}
              onChange={updateField("password")}
              invalid={hasError}
            />
            <p className="mt-2 text-right text-xs text-slate-500">
              Mot de passe oublié ?{" "}
              <span className="font-medium text-slate-700">
                Contactez votre administrateur.
              </span>
            </p>
          </div>

          <SubmitButton loading={loading} loadingText="Connexion en cours…">
            Se connecter
          </SubmitButton>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="font-semibold text-primary hover:underline">
            Créer un compte
          </Link>
        </p>
      </Container>
    </AuthLayout>
  );
}






// import { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { Button } from "../../components/ui";
// import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
// import toast from "react-hot-toast";
// import logo from "../../assets/logo.png.png";

// export default function Login() {
//   const { signIn } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const user = await signIn(form.email, form.password);
//       toast.success("Connexion réussie !", { duration: 2000 });

//       const redirectTo =
//         location.state?.from ||
//         (user?.role === "AGENT" ? "/agent" : user?.role === "ADMIN" ? "/admin" : "/citoyen");

//       // Navigation directe — plus de setTimeout.
//       // signIn garantit que loading=false et user≠null avant de retourner,
//       // donc ProtectedRoute ne verra jamais un état user=null transitoire.
//       navigate(redirectTo, { replace: true });
//     } catch (err) {
//       const status = err.response?.status;
//       const msg =
//         err.response?.data?.errors?.non_field_errors?.[0] ||
//         err.response?.data?.detail ||
//         "Email ou mot de passe incorrect.";

//       // 403 = compte non activé → rediriger vers la page de renvoi
//       if (status === 403) {
//         navigate("/activation-en-attente", {
//           state: { email: form.email },
//         });
//         return;
//       }

//       toast.error(msg);
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex flex-col items-center justify-center px-4 py-10">

//       {/* Retour */}
//       <div className="w-full max-w-md mb-4">
//         <Link
//           to="/"
//           className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
//         >
//           <ArrowLeft size={13} /> Retour à l'accueil
//         </Link>
//       </div>

//       {/* Carte */}
//       <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

//         {/* En-tête coloré */}
//         <div className="bg-gradient-to-br from-primary to-primary-dark px-8 pt-8 pb-10 text-center relative overflow-hidden">
//           <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
//           <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />
//           <div className="relative z-10">
//             <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4 shadow-lg">
//               <img src={logo} alt="SunuDémarche" className="h-10 w-auto object-contain brightness-0 invert" />
//             </div>
//             <h1 className="text-xl font-bold text-white">Connexion</h1>
//             <p className="text-white/65 text-xs mt-1">Accédez à votre espace SunuDémarche</p>
//           </div>
//         </div>

//         {/* Formulaire */}
//         <div className="px-8 py-8">
//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* Email */}
//             <div>
//               <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adresse email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="email"
//                   required
//                   autoComplete="email"
//                   placeholder="vous@exemple.sn"
//                   value={form.email}
//                   onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900
//                     placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
//                 />
//               </div>
//             </div>

//             {/* Mot de passe */}
//             <div>
//               <div className="flex items-center justify-between mb-1.5">
//                 <label className="block text-xs font-semibold text-slate-600">Mot de passe</label>
//                 <span className="text-xs text-slate-400 cursor-default select-none" title="Contactez votre administrateur">
//                   Mot de passe oublié ?
//                 </span>
//               </div>
//               <div className="relative">
//                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   autoComplete="current-password"
//                   placeholder="••••••••"
//                   value={form.password}
//                   onChange={(e) => setForm({ ...form, password: e.target.value })}
//                   className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900
//                     placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                   aria-label={showPassword ? "Masquer" : "Afficher"}
//                 >
//                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//             </div>

//             <Button type="submit" className="w-full py-3" disabled={loading}>
//               {loading
//                 ? <><Loader2 size={16} className="animate-spin" /> Connexion...</>
//                 : <> Se connecter <ArrowRight size={15} /></>
//               }
//             </Button>
//           </form>

//           <p className="text-xs text-slate-500 text-center mt-6 pt-5 border-t border-slate-100">
//             Pas encore de compte ?{" "}
//             <Link to="/inscription" className="text-primary font-semibold hover:underline">
//               S'inscrire gratuitement
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
