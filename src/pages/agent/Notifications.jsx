import { useEffect, useState } from "react";
import { Bell, CheckCheck, Loader2, Inbox } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Button } from "../../components/ui";

export default function AgentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listNotifications()
      .then(({ data }) => setNotifications(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">Consultez l'historique de vos alertes et des mises à jour de dossiers.</p>
        </div>
      </div>

      {/* Carte Liste des notifications */}
      <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin mb-2 text-primary" />
            <p className="text-xs">Chargement des notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">Aucune notification</p>
            <p className="text-slate-400 text-xs mt-1">Vous êtes à jour, aucune nouvelle alerte pour le moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`py-4 -mx-4 px-4 rounded-xl transition-colors flex items-start gap-3.5 ${
                  n.is_read ? "hover:bg-slate-50/60" : "bg-primary/[0.02] hover:bg-primary/[0.04]"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.is_read ? "bg-slate-100 text-slate-500" : "bg-primary/10 text-primary"
                }`}>
                  <Bell size={18} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-bold truncate ${n.is_read ? "text-slate-800" : "text-slate-900"}`}>
                      {n.title}
                    </h4>
                    {n.created_at && (
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {new Date(n.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}