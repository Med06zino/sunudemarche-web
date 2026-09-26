import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png.png";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    first_name: "", 
    last_name: "", 
    email: "", 
    phone_number: "", 
    password: "", 
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      toast.error("Les mots de passe ne correspondent pas.", {
        style: { background: '#EF4444', color: '#fff', borderRadius: '12px' }
      });
      return;
    }

    if (!acceptTerms) {
      toast.error("Veuillez accepter la politique de confidentialité.", {
        style: { background: '#EF4444', color: '#fff', borderRadius: '12px' }
      });
      return;
    }

    setLoading(true);

    try {
      await signUp(form);
      
      toast.success("Compte créé avec succès ! Redirection...", {
        duration: 3000,
        style: { background: '#10B981', color: '#fff', borderRadius: '12px' },
      });

      setTimeout(() => {
        navigate("/connexion", { replace: true });
      }, 1500);

    } catch (err) {
      const errors = err.response?.data?.errors || err.response?.data;
      const firstError = errors && Object.values(errors)?.[0];
      const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError || "Une erreur est survenue.";
      
      toast.error(errorMessage, {
        duration: 4000,
        style: { background: '#EF4444', color: '#fff', borderRadius: '12px' },
      });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Bouton de retour global positionné proprement au-dessus de la carte */}
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
        
        {/* COLONNE DE GAUCHE : Fond Blanc avec le Logo et les textes d'origine */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50/50 to-white p-8 lg:p-10 flex flex-col justify-between items-center border-r border-slate-100 text-center relative">
          
          <div className="w-full">
            {/* Espace vide pour garder l'alignement vertical */}
          </div>

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

        {/* COLONNE DE DROITE : Le Formulaire Pro */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">Créer un compte</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Veuillez renseigner vos informations personnelles pour vous inscrire.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Prénom & Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Mouhamed"
                    value={form.first_name} 
                    onChange={update("first_name")} 
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nom</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Niang"
                    value={form.last_name} 
                    onChange={update("last_name")} 
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

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
                  onChange={update("email")} 
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Numéro de téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="tel" 
                  placeholder="+221 77 000 00 00"
                  value={form.phone_number} 
                  onChange={update("phone_number")} 
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Mots de passe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="8 caractères min."
                    value={form.password}
                    onChange={update("password")}
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirmation</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Répéter le mot de passe"
                    value={form.password_confirmation}
                    onChange={update("password_confirmation")}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox Conditions & Confidentialité */}
            <div className="flex items-start gap-2.5 pt-1">
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
              />
              <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer select-none leading-relaxed">
                J'accepte les <span className="text-primary font-medium hover:underline">conditions d'utilisation</span> et la <span className="text-primary font-medium hover:underline">politique de confidentialité</span>.
              </label>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-3">
              <Button 
                type="submit" 
                className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création du compte en cours...
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Lien vers la connexion */}
          <p className="text-xs sm:text-sm text-slate-500 text-center mt-6 pt-5 border-t border-slate-100">
            Déjà un compte ?{" "}
            <Link to="/connexion" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}