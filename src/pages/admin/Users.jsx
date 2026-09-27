import { useEffect, useState } from "react";
import { Users, Loader2, Mail, Shield, Search, FolderOpen } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, PageLoader, EmptyState, Badge } from "../../components/ui";

const ROLE_BADGES = {
  CITIZEN: { label: "Citoyen", variant: "default" },
  AGENT:   { label: "Agent",   variant: "primary" },
  ADMIN:   { label: "Admin",   variant: "warning" },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.listAdminUsers()
      .then(({ data }) => {
        const list = data.results || data.data || data;
        setUsers(list);
        setFiltered(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q ? users.filter((u) =>
        `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(q)
      ) : users
    );
  }, [search, users]);

  return (
    <div className="max-w-5xl space-y-6 pb-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Utilisateurs</h1>
          <p className="text-slate-500 text-sm mt-1">Comptes enregistrés sur la plateforme.</p>
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
          <PageLoader message="Chargement des utilisateurs..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="Aucun utilisateur trouvé"
            description={search ? "Modifiez votre recherche." : "Aucun compte enregistré."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {["Nom", "Email", "Rôle", "Statut", "Inscription"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((u) => {
                  const role = ROLE_BADGES[u.role] ?? { label: u.role, variant: "default" };
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {`${u.first_name || ""} ${u.last_name || ""}`.trim() || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={role.variant}>{role.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={u.is_active ? "success" : "default"}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {u.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
              <p className="text-xs text-slate-400">{filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
