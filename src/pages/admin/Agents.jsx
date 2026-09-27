import { useEffect, useState } from "react";
import { UserCog, Search, FolderOpen } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, PageLoader, EmptyState, Badge } from "../../components/ui";

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.listAdminAgents()
      .then(({ data }) => {
        const list = data.results || data.data || data;
        setAgents(list);
        setFiltered(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q ? agents.filter((a) =>
        `${a.full_name} ${a.email} ${a.center_name} ${a.matricule}`.toLowerCase().includes(q)
      ) : agents
    );
  }, [search, agents]);

  return (
    <div className="max-w-5xl space-y-6 pb-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agents</h1>
          <p className="text-slate-500 text-sm mt-1">Agents enregistrés et leurs affectations.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text" placeholder="Rechercher..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all shadow-sm"
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <PageLoader message="Chargement des agents..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={UserCog} title="Aucun agent trouvé"
            description={search ? "Modifiez votre recherche." : "Aucun agent enregistré."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {["Agent", "Matricule", "Centre", "Statut"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{a.full_name || "—"}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.email}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{a.matricule || "—"}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{a.center_name || "—"}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={a.is_active_agent ? "success" : "default"}>
                        <span className={`w-1.5 h-1.5 rounded-full ${a.is_active_agent ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {a.is_active_agent ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
              <p className="text-xs text-slate-400">{filtered.length} agent{filtered.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
