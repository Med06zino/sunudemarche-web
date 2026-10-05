import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Shield } from "lucide-react";
import logo from "../assets/logo.png.png";

const NAV = [
  { to: "/services", label: "Services administratifs" },
  { to: "/a-propos", label: "À propos" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact & Support" },
  { to: "/connexion", label: "Espace Agent / Admin" },
];

const CONTACTS = [
  { Icon: MapPin, text: "Dakar, Sénégal, Keur Massar" },
  { Icon: Mail, text: "devtekk6@gmail.com" },
  { Icon: Phone, text: "+221 78 523 42 03" },
];

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* Branding */}
        <div className="lg:col-span-2 space-y-4">
          <img
            src={logo}
            alt="SunuDémarche"
            className="h-14 w-auto object-contain brightness-0 invert opacity-90"
          />
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Plateforme officielle pour la gestion en ligne des démarches administratives au Sénégal. Sécurisée, simple et accessible 24h/24.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <Shield size={12} />
            République du Sénégal
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Navigation</h3>
          <ul className="space-y-2.5">
            {NAV.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Contact</h3>
          <ul className="space-y-3">
            {CONTACTS.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 text-sm text-slate-400">
                <Icon size={14} className="shrink-0 mt-0.5 text-slate-500" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Barre basse */}
      <div className="border-t border-slate-800 py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SunuDémarche — Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Conditions d'utilisation</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
