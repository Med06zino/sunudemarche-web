import { ShieldCheck, FileText, Cpu, ArrowRight, CheckCircle2, Target, Users } from "lucide-react";
import { Card } from "../../components/ui";

const VALUES = [
  {
    icon: Target,
    title: "Notre mission",
    desc: "Simplifier les relations entre citoyens et administration publique grâce à une solution numérique moderne, transparente et sécurisée.",
    color: "bg-primary/8 text-primary",
  },
  {
    icon: Users,
    title: "Pour les citoyens",
    desc: "Un accès universel aux services administratifs, sans barrières géographiques, depuis n'importe quel appareil connecté.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "Transparence légale",
    desc: "SunuDémarche est une interface numérique de liaison. Les institutions étatiques restent les seules habilitées à valider et délivrer les documents officiels.",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* En-tête */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-4 border border-primary/15">
          Notre mission
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          À propos de SunuDémarche
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Simplifier les relations entre les citoyens et l'administration publique au Sénégal grâce au numérique.
        </p>
      </div>

      {/* Valeurs */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {VALUES.map(({ icon: Icon, title, desc, color }) => (
          <Card key={title} hover className="p-6 flex flex-col gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Bloc principal */}
      <Card className="p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0 mt-1">
            <Cpu size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Une plateforme technologique au service des citoyens</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              SunuDémarche permet d'effectuer et de suivre vos démarches en ligne de bout en bout : dépôt du dossier, suivi en temps réel, notifications à chaque étape et information sur la disponibilité du document officiel.
            </p>
          </div>
        </div>
      </Card>

      {/* Services actuels & roadmap */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card hover className="p-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <FileText size={18} />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-2">Service actuellement disponible</h3>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            La plateforme prend en charge la demande d'extrait de naissance — première démarche officielle disponible en ligne.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 size={13} /> Opérationnel
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-4">
            <ArrowRight size={18} />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-2">Prochaines évolutions</h3>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            D'autres démarches seront intégrées progressivement :
          </p>
          <ul className="space-y-1.5">
            {["Extrait de mariage & décès", "Certificat de résidence", "Attestations administratives diverses"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-slate-500">
                <ArrowRight size={12} className="text-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

    </div>
  );
}
