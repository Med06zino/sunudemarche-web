import { useEffect, useState } from "react";
import { Users, Loader2, Shield, Building2, BadgeCheck, Inbox } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card } from "../../components/ui";

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.listAdminAgents()
      .then(({ data }) => setAgents(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des agents</h1>
          <p className="text-slate-500 text-sm mt-1">Consultez la liste des agents enregistrés, leurs matricules et leurs centres d'affectation.</p>
        </div>
      </div>

      {/* Tableau / Carte des agents */}
      <Card className="p-0 overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin mb-2 text-primary" />
            <p className="text-xs">Chargement des agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/50">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">Aucun agent trouvé</p>
            <p className="text-slate-400 text-xs mt-1">Aucun compte agent n'est enregistré pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4 flex items-center gap-2">
                    <Users size={14} className="text-slate-400" /> Nom complet
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck size={14} className="text-slate-400" /> Matricule
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-slate-400" /> Centre
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <Shield size={14} className="text-slate-400" /> Statut
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agents.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {a.full_name || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                      {a.matricule || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {a.center_name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        a.is_active_agent 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" 
                          : "bg-slate-100 text-slate-600 border border-slate-200/60"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${a.is_active_agent ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {a.is_active_agent ? "Actif" : "Inactif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}