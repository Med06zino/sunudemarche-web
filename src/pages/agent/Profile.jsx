import { User, Mail, BadgeCheck, Building2, Shield } from "lucide-react";
import { Card, Input, Badge } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

function Field({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
        <Icon size={12} className="text-slate-400" /> {label}
      </label>
      <Input
        value={value || "—"}
        disabled
        className={`bg-slate-50 text-slate-700 cursor-not-allowed border-slate-100 ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}

export default function AgentProfile() {
  const { user } = useAuth();
  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Agent";
  const initials = fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="max-w-2xl space-y-6 pb-10 animate-fade-in">

      {/* En-tête profil */}
      <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-extrabold shadow-sm shadow-primary/10">
          {initials || <User size={24} />}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{fullName}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="primary">
              <Shield size={10} /> Agent de traitement
            </Badge>
            <span className="text-xs text-slate-400">{user?.email}</span>
          </div>
        </div>
      </div>

      <Card className="p-6 sm:p-8 space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Informations du compte</h2>
          <p className="text-xs text-slate-400 mt-1">Ces données sont gérées par l'administration et ne peuvent pas être modifiées ici.</p>
        </div>

        <div className="space-y-4">
          <Field icon={User}      label="Nom complet"        value={fullName} />
          <Field icon={Mail}      label="Adresse email"      value={user?.email} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Field icon={BadgeCheck}  label="Matricule"       value={user?.agent_profile?.matricule} mono />
            <Field icon={Building2}   label="Centre"          value={user?.agent_profile?.center_name} />
          </div>
        </div>

        {user?.agent_profile?.is_active_agent !== undefined && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Statut du compte</span>
            <Badge variant={user.agent_profile.is_active_agent ? "success" : "default"}>
              <span className={`w-1.5 h-1.5 rounded-full ${user.agent_profile.is_active_agent ? "bg-emerald-500" : "bg-slate-400"}`} />
              {user.agent_profile.is_active_agent ? "Actif" : "Inactif"}
            </Badge>
          </div>
        )}
      </Card>
    </div>
  );
}
