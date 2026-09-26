import { useEffect, useState } from "react";
import { Users, Loader2, Mail, Shield, BadgeCheck, Inbox } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card } from "../../components/ui";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.listAdminUsers()
      .then(({ data }) => setUsers(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-slate-500 text-sm mt-1">Consultez la liste des comptes enregistrés sur la plateforme, leurs rôles et leurs statuts.</p>
        </div>
      </div>

      {/* Tableau / Carte des utilisateurs */}
      <Card className="p-0 overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin mb-2 text-primary" />
            <p className="text-xs">Chargement des utilisateurs...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/50">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">Aucun utilisateur trouvé</p>
            <p className="text-slate-400 text-xs mt-1">Aucun compte utilisateur n'est enregistré pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} className="text-slate-400" /> Nom complet
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} className="text-slate-400" /> Adresse e-mail
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <Shield size={14} className="text-slate-400" /> Rôle
                    </span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck size={14} className="text-slate-400" /> Statut
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {u.first_name || u.last_name ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {u.email || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 text-xs bg-primary/5 text-primary px-2.5 py-1 rounded-lg border border-primary/10">
                        {u.role || "Utilisateur"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        u.is_active 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" 
                          : "bg-slate-100 text-slate-600 border border-slate-200/60"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {u.is_active ? "Actif" : "Inactif"}
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