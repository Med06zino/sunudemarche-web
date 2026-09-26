import { useEffect, useState } from "react";
import { ShieldAlert, Loader2, Calendar, User, Activity, FileCode, Globe, Inbox } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card } from "../../components/ui";

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.listAdminAuditLogs()
      .then(({ data }) => setLogs(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Journal d'audit</h1>
          <p className="text-slate-500 text-sm mt-1">Surveillez et traquez l'historique des actions et des événements de sécurité sur la plateforme.</p>
        </div>
      </div>

      {/* Tableau / Carte d'audit */}
      <Card className="p-0 overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin mb-2 text-primary" />
            <p className="text-xs">Chargement des journaux d'audit...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/50">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">Aucun journal d'audit</p>
            <p className="text-slate-400 text-xs mt-1">Aucune activité enregistrée pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" /> Date & Heure
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-slate-400" /> Utilisateur
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <Activity size={14} className="text-slate-400" /> Action
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <FileCode size={14} className="text-slate-400" /> Objet
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <Globe size={14} className="text-slate-400" /> Adresse IP
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {l.user_email || (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-600 font-normal">
                          Système
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 text-xs bg-primary/5 text-primary px-2.5 py-1 rounded-lg border border-primary/10">
                        {l.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                      {l.object_type || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {l.ip_address || "—"}
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