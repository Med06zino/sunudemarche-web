import { useEffect, useState } from "react";
import { ShieldCheck, Search, FolderOpen } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, PageLoader, EmptyState, Badge } from "../../components/ui";

const ACTION_VARIANTS = {
  LOGIN: "primary", CREATE_REQUEST: "success", UPDATE_REQUEST: "info",
  CHANGE_STATUS: "warning", VALIDATE_REQUEST: "success", REFUSE_REQUEST: "error",
  UPLOAD_DOCUMENT: "info", DOWNLOAD_DOCUMENT: "info",
};

const ACTION_LABELS = {
  LOGIN: "Connexion", CREATE_REQUEST: "Création", UPDATE_REQUEST: "Mise à jour",
  CHANGE_STATUS: "Changement statut", REQUEST_CORRECTION: "Correction",
  VALIDATE_REQUEST: "Validation", REFUSE_REQUEST: "Refus",
  UPLOAD_DOCUMENT: "Téléversement", DOWNLOAD_DOCUMENT: "Téléchargement", UPDATE_USER: "Màj utilisateur",
};

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.listAdminAuditLogs()
      .then(({ data }) => {
        const list = data.results || data.data || data;
        setLogs(list);
        setFiltered(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q ? logs.filter((l) =>
        `${l.user_email} ${l.action} ${l.object_type} ${l.ip_address}`.toLowerCase().includes(q)
      ) : logs
    );
  }, [search, logs]);

  return (
    <div className="max-w-5xl space-y-6 pb-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Journal d'audit</h1>
          <p className="text-slate-500 text-sm mt-1">Historique complet des actions sur la plateforme.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text" placeholder="Filtrer les logs..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all shadow-sm"
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <PageLoader message="Chargement du journal..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="Aucune entrée dans le journal"
            description={search ? "Aucune correspondance." : "Aucune activité enregistrée."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {["Date & Heure", "Utilisateur", "Action", "Objet", "Adresse IP"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-medium text-slate-700">
                      {l.user_email || <span className="text-slate-400 italic">Système</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={ACTION_VARIANTS[l.action] ?? "default"}>
                        {ACTION_LABELS[l.action] || l.action}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{l.object_type || "—"}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{l.ip_address || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
              <p className="text-xs text-slate-400">{filtered.length} entrée{filtered.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
