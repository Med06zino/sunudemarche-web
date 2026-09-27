import { useEffect, useState } from "react";
import { Bell, Inbox } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, PageLoader } from "../../components/ui";

export default function AgentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listNotifications()
      .then(({ data }) => setNotifications(data.results || data.data || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl space-y-6 pb-10 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-slate-500 text-sm mt-1">Alertes et mises à jour relatives aux dossiers de votre centre.</p>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <PageLoader message="Chargement..." />
        ) : notifications.length === 0 ? (
          <div className="text-center py-14 px-4">
            <Inbox className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="font-bold text-slate-600 text-sm">Aucune notification</p>
            <p className="text-xs text-slate-400 mt-1">Vous êtes à jour !</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-5 py-4 transition-colors
                  ${n.is_read ? "hover:bg-slate-50" : "bg-primary/[0.03] hover:bg-primary/[0.06]"}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5
                  ${n.is_read ? "bg-slate-100 text-slate-400" : "bg-primary/10 text-primary"}`}>
                  <Bell size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${n.is_read ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                      {n.title}
                    </p>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {new Date(n.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
