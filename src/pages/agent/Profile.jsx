import { User, Mail, BadgeCheck, Building2, Shield } from "lucide-react";
import { Card, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function AgentProfile() {
  const { user } = useAuth();

  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Agent";

  return (
    <div className="max-w-2xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="border-b border-slate-100 pb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shadow-sm shadow-primary/20">
          {user?.first_name?.[0] || <User size={28} />}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{fullName}</h1>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              Agent de traitement
            </span>
            <span>•</span>
            <span>{user?.email || "—"}</span>
          </p>
        </div>
      </div>

      {/* Carte des informations professionnelles */}
      <Card className="p-8 rounded-2xl border border-slate-100 shadow-sm bg-white space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            Informations du compte agent
          </h3>
          <p className="text-xs text-slate-500 mb-6">Ces informations sont gérées par l'administration centrale et ne peuvent pas être modifiées directement.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User size={14} className="text-slate-400" /> Nom complet
            </label>
            <Input 
              value={fullName} 
              disabled 
              className="bg-slate-50/80 border-slate-200 text-slate-700 rounded-xl" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail size={14} className="text-slate-400" /> Adresse email
            </label>
            <Input 
              value={user?.email || ""} 
              disabled 
              className="bg-slate-50/80 border-slate-200 text-slate-700 rounded-xl" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <BadgeCheck size={14} className="text-slate-400" /> Numéro de matricule
              </label>
              <Input 
                value={user?.agent_profile?.matricule || "—"} 
                disabled 
                className="bg-slate-50/80 border-slate-200 text-slate-700 rounded-xl font-mono" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-400" /> Centre d'affectation
              </label>
              <Input 
                value={user?.agent_profile?.center_name || "—"} 
                disabled 
                className="bg-slate-50/80 border-slate-200 text-slate-700 rounded-xl font-semibold" 
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}