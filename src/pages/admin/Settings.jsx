import { Bell, Shield, CreditCard, Zap, Info } from "lucide-react";
import { Card, Alert } from "../../components/ui";

const MODULES = [
  { icon: Bell,      color: "bg-primary/8 text-primary",         title: "Notifications",   desc: "Canaux SMS, e-mail et webhooks" },
  { icon: Shield,    color: "bg-emerald-500/8 text-emerald-600", title: "Intégrations",    desc: "Passerelles et services tiers" },
  { icon: CreditCard,color: "bg-amber-500/8 text-amber-600",    title: "Paiements",       desc: "Solutions de paiement en ligne" },
  { icon: Zap,       color: "bg-purple-500/8 text-purple-600",  title: "Automatisations", desc: "Règles et workflows automatiques" },
];

export default function AdminSettings() {
  return (
    <div className="max-w-3xl space-y-6 pb-10 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-slate-500 text-sm mt-1">Configurations globales et options avancées de la plateforme.</p>
      </div>

      <Alert variant="info">
        <div className="flex items-start gap-2">
          <Info size={14} className="shrink-0 mt-0.5" />
          <span>La configuration avancée (canaux de notification, intégrations, paiements) sera disponible dans une prochaine version.</span>
        </div>
      </Alert>

      <Card className="p-6">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">Modules à venir</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {MODULES.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100 opacity-70">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
