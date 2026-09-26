import { useEffect, useState } from "react";
import { Bell, CheckCircle2, Loader2, Sparkles, Inbox } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, EmptyState } from "../../components/ui";

export default function CitizenNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    api.listNotifications()
      .then(({ data }) => setNotifications(data.results || data))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleRead(id) {
    await api.markNotificationRead(id);
    load();
  }

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-slate-500 text-sm mt-1">Restez informé en temps réel de l'avancement de vos demandes administratives.</p>
      </div>

      {/* Carte principale */}
      <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin mb-2 text-primary" />
            <p className="text-xs">Chargement de vos notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">Aucune notification pour le moment.</p>
            <p className="text-slate-400 text-xs mt-1">Vous serez notifié dès qu'un changement intervient sur vos dossiers.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.is_read && handleRead(n.id)}
                className={`w-full text-left flex items-start gap-4 py-4 -mx-4 px-4 rounded-xl transition-all duration-200 ${
                  n.is_read ? "hover:bg-slate-50/80" : "bg-primary/5 hover:bg-primary/10"
                }`}
              >
                {/* Indicateur de lecture ou icône */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.is_read ? "bg-slate-100 text-slate-400" : "bg-primary text-white shadow-sm shadow-primary/30"
                }`}>
                  <Bell size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm ${n.is_read ? "font-medium text-slate-800" : "font-bold text-slate-900"}`}>
                      {n.title}
                    </span>
                    {!n.is_read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        Nouveau
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                    <span>{new Date(n.created_at).toLocaleString("fr-FR")}</span>
                    {n.request_reference && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-slate-600">{n.request_reference}</span>
                      </>
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