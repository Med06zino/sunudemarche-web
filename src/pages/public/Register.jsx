import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png.png";

const FIELD = (label, name, type, placeholder, icon) => ({ label, name, type, placeholder, icon });

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "",
    phone_number: "", password: "", password_confirmation: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!terms) {
      toast.error("Veuillez accepter les conditions d'utilisation.");
      return;
    }
    setLoading(true);
    try {
      await signUp(form);
      toast.success("Compte créé avec succès !");
      // Navigation directe — signUp appelle signIn qui garantit
      // loading=false + user≠null avant de retourner.
      navigate("/citoyen", { replace: true });
    } catch (err) {
      const errors = err.response?.data?.errors || err.response?.data;
      const first = errors && Object.values(errors)?.[0];
      toast.error(Array.isArray(first) ? first[0] : first || "Une erreur est survenue.");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 " +
    "placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex flex-col items-center justify-center px-4 py-10">

      {/* Retour */}
      <div className="w-full max-w-xl mb-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft size={13} /> Retour à l'accueil
        </Link>
      </div>

      {/* Carte */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

        {/* En-tête */}
        <div className="bg-gradient-to-br from-primary to-primary-dark px-8 pt-8 pb-10 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img src={logo} alt="SunuDémarche" className="h-10 w-auto object-contain brightness-0 invert" />
            </div>
            <h1 className="text-xl font-bold text-white">Créer un compte</h1>
            <p className="text-white/65 text-xs mt-1">Rejoignez la plateforme SunuDémarche</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Prénom & Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { field: "first_name", label: "Prénom", ph: "Mouhamed" },
                { field: "last_name",  label: "Nom",    ph: "Niang" },
              ].map(({ field, label, ph }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text" required placeholder={ph}
                      value={form[field]} onChange={set(field)}
                      className={inputCls}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email" required autoComplete="email"
                  placeholder="vous@exemple.sn"
                  value={form.email} onChange={set("email")}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Téléphone <span className="font-normal text-slate-400">(facultatif)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="tel" placeholder="+221 77 000 00 00"
                  value={form.phone_number} onChange={set("phone_number")}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Mots de passe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { field: "password", label: "Mot de passe", show: showPwd, toggle: () => setShowPwd(!showPwd), ph: "8 caractères min." },
                { field: "password_confirmation", label: "Confirmation", show: showConfirm, toggle: () => setShowConfirm(!showConfirm), ph: "Répétez le mot de passe" },
              ].map(({ field, label, show, toggle, ph }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={show ? "text" : "password"}
                      required minLength={8} placeholder={ph}
                      value={form[field]} onChange={set(field)}
                      className={`${inputCls} pr-10`}
                    />
                    <button type="button" onClick={toggle}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CGU */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${terms ? "bg-primary border-primary" : "border-slate-300 group-hover:border-primary/50"}`}>
                {terms && <CheckCircle2 size={11} className="text-white" />}
              </div>
              <input type="checkbox" className="sr-only" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
              <span className="text-xs text-slate-600 leading-relaxed">
                J'accepte les{" "}
                <span className="text-primary font-medium hover:underline cursor-pointer">conditions d'utilisation</span>
                {" "}et la{" "}
                <span className="text-primary font-medium hover:underline cursor-pointer">politique de confidentialité</span>.
              </span>
            </label>

            <Button type="submit" className="w-full py-3 mt-2" disabled={loading}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Création du compte...</>
                : <>Créer mon compte <ArrowRight size={15} /></>
              }
            </Button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6 pt-5 border-t border-slate-100">
            Déjà un compte ?{" "}
            <Link to="/connexion" className="text-primary font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
