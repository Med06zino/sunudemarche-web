import { useEffect, useState } from "react";
import { Bell, Inbox, CheckCheck } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Button, PageLoader } from "../../components/ui";

export default function CitizenNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    api.listNotifications()
      .then(({ data }) => setNotifications(data.results || data.data || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleRead(id) {
    await api.markNotificationRead(id).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.is_read);
    await Promise.all(unread.map((n) => api.markNotificationRead(n.id).catch(() => {})));
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-2xl space-y-6 pb-10 animate-fade-in">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">Suivi en temps réel de vos dossiers.</p>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={markAllRead} className="gap-1.5 text-xs">
            <CheckCheck size={14} /> Tout marquer lu
          </Button>
        )}
      </div>

      {/* Badge non lus */}
      {unreadCount > 0 && (
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-full border border-primary/15">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <PageLoader message="Chargement des notifications..." />
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Inbox className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="font-bold text-slate-600 text-sm">Aucune notification</p>
            <p className="text-xs text-slate-400 mt-1">
              Vous serez notifié dès qu'un changement intervient sur vos dossiers.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.is_read && handleRead(n.id)}
                className={`w-full text-left flex items-start gap-4 px-5 py-4 transition-colors
                  ${n.is_read ? "hover:bg-slate-50" : "bg-primary/[0.03] hover:bg-primary/[0.06] cursor-pointer"}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5
                  ${n.is_read ? "bg-slate-100 text-slate-400" : "bg-primary text-white shadow-sm shadow-primary/20"}`}>
                  <Bell size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${n.is_read ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                      {n.title}
                    </p>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                    <span>{new Date(n.created_at).toLocaleString("fr-FR")}</span>
                    {n.request_reference && (
                      <><span>·</span><span className="font-medium text-slate-500">{n.request_reference}</span></>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
