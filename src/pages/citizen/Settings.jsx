import { useState } from "react";
import { Bell, Smartphone, Mail, MessageSquare, Info } from "lucide-react";
import { Card, Alert } from "../../components/ui";

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0">
      <div className="space-y-0.5 pr-4">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-400 leading-relaxed">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200
          ${checked ? "bg-primary" : "bg-slate-200"}`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-sm transform transition-transform duration-200
            ${checked ? "translate-x-5" : "translate-x-1"}`}
          style={{ height: "18px", width: "18px" }}
        />
      </button>
    </div>
  );
}

const CHANNELS = [
  { icon: Mail,          label: "Email",    soon: true },
  { icon: Smartphone,    label: "SMS",      soon: true },
  { icon: MessageSquare, label: "WhatsApp", soon: true },
];

export default function CitizenSettings() {
  const [notifInternal, setNotifInternal] = useState(true);

  return (
    <div className="max-w-2xl space-y-6 pb-10 animate-fade-in">

      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez vos préférences de notifications et de compte.</p>
      </div>

      {/* Notifications actives */}
      <Card className="p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-primary/8 text-primary flex items-center justify-center">
            <Bell size={15} />
          </div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Notifications</h2>
        </div>

        <Toggle
          checked={notifInternal}
          onChange={setNotifInternal}
          label="Notifications internes"
          description="Recevez une alerte sur la plateforme à chaque changement de statut de vos dossiers."
        />
      </Card>

      {/* Canaux à venir */}
      <Card className="p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Smartphone size={15} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Canaux multicanaux</h2>
          </div>
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
            Prochainement
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {CHANNELS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100 opacity-60">
              <Icon size={20} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        <Alert variant="info">
          Les notifications par SMS, email et WhatsApp seront disponibles dans une prochaine mise à jour pour un suivi encore plus direct de vos démarches.
        </Alert>
      </Card>
    </div>
  );
}
