import { Link } from "react-router-dom";
import {
  UserPlus, FileSearch, Send, CheckCircle2,
  ShieldCheck, Clock, MapPin, ArrowRight,
  Star, FileText, ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui";

const STEPS = [
  { n: "01", icon: UserPlus,    title: "Créez votre compte",     desc: "Inscription rapide avec votre adresse email." },
  { n: "02", icon: FileSearch,  title: "Choisissez le service",   desc: "Sélectionnez votre démarche et votre centre." },
  { n: "03", icon: Send,        title: "Remplissez le formulaire", desc: "Quelques informations suffisent pour constituer votre dossier." },
  { n: "04", icon: CheckCircle2, title: "Récupérez votre acte",   desc: "Notifié dès que votre document est prêt à retirer." },
];

const TRUST = [
  {
    icon: ShieldCheck,
    title: "100 % sécurisé",
    desc: "Chiffrement TLS, données personnelles protégées conformément à la loi.",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    icon: Clock,
    title: "Suivi en temps réel",
    desc: "Consultez l'avancement de vos dossiers 24h/24, 7j/7.",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    icon: MapPin,
    title: "Zéro déplacement inutile",
    desc: "Évitez les files d'attente. Vous vous déplacez seulement pour récupérer.",
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
];

export default function Home() {
  return (
    <div className="bg-background text-text">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        {/* Fond décoratif subtil */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-6 border border-primary/15">
            <Star size={12} className="fill-primary" />
            Plateforme officielle des démarches au Sénégal
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            Vos démarches administratives,<br className="hidden sm:block" />
            <span className="text-primary"> en ligne et sans stress.</span>
          </h1>

          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Demandez vos actes officiels depuis chez vous, suivez leur avancement en temps réel et ne vous déplacez qu'une seule fois — pour récupérer votre document.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/inscription">
              <Button size="lg" className="w-full sm:w-auto shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30">
                Commencer ma démarche
                <ArrowRight size={17} />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Voir les services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONFIANCE ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TRUST.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────────── */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mb-3">
              Simple & rapide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Comment ça se passe ?</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              Quatre étapes simples pour obtenir vos documents officiels sans vous déplacer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.n}
                  className="relative bg-background p-6 rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-200 group"
                >
                  <span className="absolute top-4 right-4 text-[11px] font-bold text-slate-200 select-none">
                    {step.n}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 z-10">
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SERVICE EN VEDETTE ────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-primary/20">
          {/* Déco */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Service disponible</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
                Extrait de Naissance
              </h2>
              <p className="text-white/75 text-sm leading-relaxed max-w-md">
                Faites votre demande en ligne et suivez l'avancement de votre dossier en toute sérénité. Simple, rapide et sécurisé.
              </p>
            </div>
            <Link to="/inscription" className="shrink-0">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-bold text-sm hover:bg-slate-50 transition-colors shadow-lg">
                Faire ma demande
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
