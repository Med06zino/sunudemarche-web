import { Link } from "react-router-dom";
import { Button } from "../../components/ui";
import { UserPlus, FileSearch, Send, CheckCircle2, ShieldCheck, Clock, MapPin, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Créez votre compte",
    desc: "Inscrivez-vous simplement avec votre adresse email.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Choisissez votre service",
    desc: "Sélectionnez l'extrait de naissance et votre centre.",
    icon: FileSearch,
  },
  {
    number: "03",
    title: "Faites votre demande",
    desc: "Remplissez le formulaire et suivez votre dossier avec un code unique.",
    icon: Send,
  },
  {
    number: "04",
    title: "Récupérez votre acte",
    desc: "Recevez une alerte dès que votre document est prêt.",
    icon: CheckCircle2,
  },
];

export default function Home() {
  return (
    <div className="bg-background min-h-screen text-text">
      
      {/* 1. HERO SECTION & VALEURS DE CONFIANCE */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-16 text-center">
        
        {/* Badge Officiel Simple (Agrandis et sans point vert) */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-primary text-sm font-semibold mb-6 shadow-sm border border-blue-100">
          Plateforme officielle des démarches au Sénégal
        </div>

        {/* Titre principal */}
        <h1 className="text-2xl md:text-4xl font-bold text-text tracking-tight mb-4 leading-snug">
          Simplifiez vos <span className="text-primary">démarches administratives</span> au Sénégal.
        </h1>

        {/* Sous-titre */}
        <p className="text-text-secondary text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Faites vos demandes en ligne facilement, sans stress et sans vous déplacer inutilement.
        </p>

        {/* Boutons d'action principaux */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link to="/inscription" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto text-sm px-6 py-2.5 shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Commencer ma démarche
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link to="/services" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto text-sm px-6 py-2.5 hover:bg-slate-50 transition-colors">
              Voir les services
            </Button>
          </Link>
        </div>

        {/* Indicateurs de confiance ultra-visibles */}
        <div className="pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto text-left sm:text-center">
          
          <div className="flex items-center sm:flex-col gap-4 p-5 rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 sm:mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-text">100% Sécurisé</p>
              <p className="text-xs text-text-secondary mt-0.5">Données personnelles et administratives protégées.</p>
            </div>
          </div>

          <div className="flex items-center sm:flex-col gap-4 p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-secondary flex items-center justify-center shrink-0 sm:mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-text">Suivi 24/7</p>
              <p className="text-xs text-text-secondary mt-0.5">Consultez l'avancement de vos dossiers en temps réel.</p>
            </div>
          </div>

          <div className="flex items-center sm:flex-col gap-4 p-5 rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 sm:mx-auto">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-text">Zéro Déplacement</p>
              <p className="text-xs text-text-secondary mt-0.5">Évitez les files d'attente interminables aux guichets.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SECTION COMMENT ÇA MARCHE */}
      <section className="bg-surface border-y border-slate-200/80 py-16">
        <div className="max-w-5xl mx-auto px-4">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-text mb-2">
              Comment ça se passe ?
            </h2>
            <p className="text-text-secondary text-sm max-w-sm mx-auto">
              Quatre étapes simples pour obtenir vos documents officiels.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map((step) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={step.title} 
                  className="bg-background p-5 rounded-xl border border-slate-100 shadow-sm relative flex flex-col items-center text-center group hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <span className="absolute top-3 right-3 text-[11px] font-bold text-slate-300">
                    {step.number}
                  </span>

                  <h3 className="font-semibold text-text text-base mb-1">
                    {step.title}
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SECTION SERVICE EN VEDETTE (Simple, épurée et humaine) */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          
          {/* Petit badge discret */}
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold mb-3">
            Premier service disponible
          </span>

          <h2 className="text-xl md:text-2xl font-bold text-text mb-2">
            Besoin d'un Extrait de Naissance ?
          </h2>

          <p className="text-text-secondary text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Faites votre demande en ligne dès maintenant et suivez l'avancement de votre dossier en toute sérénité.
          </p>

          <Link to="/inscription">
            <Button className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2.5 text-sm shadow-sm transition-all">
              Faire ma demande d'extrait
            </Button>
          </Link>

        </div>
      </section>

    </div>
  );
}