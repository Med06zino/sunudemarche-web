import { ShieldCheck, FileText, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* En-tête */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold mb-3">
          Notre Mission
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">
          À propos de SunuDémarche
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Simplifier les relations entre les citoyens et l'administration publique au Sénégal grâce à une solution numérique moderne, transparente et sécurisée.
        </p>
      </div>

      {/* Bloc principal : Qu'est-ce que SunuDémarche ? */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 mt-1">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text mb-2">Une plateforme technologique au service des citoyens</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              SunuDémarche est une plateforme conçue pour faciliter l'accès aux documents administratifs. Elle permet d'effectuer et de suivre vos démarches en ligne de bout en bout : dépôt du dossier, suivi en temps réel de l'état de traitement, notifications et information sur la mise à disposition du document officiel.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text mb-2">Transparence et Cadre Légal</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong className="text-text font-medium">Important :</strong> SunuDémarche agit en tant qu'interface numérique de liaison et ne se substitue pas aux institutions étatiques. La plateforme connecte les usagers aux organismes compétents, qui restent les seuls habilités à valider et délivrer les documents officiels.
            </p>
          </div>
        </div>
      </div>

      {/* Grille : Services actuels et perspectives */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Service Actuel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-text text-base mb-2">Service disponible</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              La plateforme prend actuellement en charge la demande d'extrait de naissance, permettant d'initier vos formalités civiles en quelques clics.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Déjà opérationnel sur la plateforme</span>
          </div>
        </div>

        {/* Roadmap / Évolutions futures */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-4">
              <ArrowRight className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-text text-base mb-2">Prochaines étapes</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              D'autres démarches administratives seront intégrées progressivement pour couvrir l'essentiel des besoins courants :
            </p>
            <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
              <li>Extrait de mariage & de décès</li>
              <li>Certificat de résidence</li>
              <li>Attestations et actes administratifs divers</li>
            </ul>
          </div>
          <div className="text-xs text-slate-400 font-medium pt-3 border-t border-slate-100">
            Roadmap d'évolution continue
          </div>
        </div>

      </div>

    </div>
  );
}