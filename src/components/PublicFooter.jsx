import { Link } from "react-router-dom";
import { ExternalLink, Mail, MapPin, Phone, ShieldAlert, Sparkles } from "lucide-react";
import logo from "../assets/logo.png.png"; // <-- Importe l'image directement ici

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-white mt-24 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-3">
        {/* Colonne 1 : Logo & Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="SunuDémarche Logo" 
              className="h-16 w-auto object-contain brightness-0 invert opacity-90" 
            />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Simplifiez vos démarches administratives au Sénégal. Accédez aux services de vos centres en toute simplicité.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-medium border border-primary/20">
            <Sparkles size={12} /> République du Sénégal
          </div>
        </div>

        {/* Colonne 2 : Liens utiles */}
        <div className="space-y-4">
          <div className="font-semibold text-xs uppercase tracking-wider text-slate-300">
            Navigation rapide
          </div>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <Link to="/services" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>Services administratifs</span>
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>Foire aux questions (FAQ)</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>Contact & Support</span>
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>Espace Agent / Administration</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Avertissement légal */}
        <div className="space-y-4">
          <div className="font-semibold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-amber-400" /> Avertissement légal
          </div>
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            SunuDémarche est une plateforme technologique facilitant la mise en relation et le suivi des dossiers auprès des organismes compétents. Elle ne se substitue pas aux institutions officielles.
          </p>
        </div>
      </div>

      {/* Barre de bas de page */}
      <div className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} SunuDémarche — Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Conditions d'utilisation</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Politique de confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}