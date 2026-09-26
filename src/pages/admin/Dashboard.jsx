import { useEffect, useState } from "react";
import { FileText, Clock, Users, UserCog, Loader2, BarChart3, Inbox } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card } from "../../components/ui";

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = {
    primary: "bg-blue-500/10 text-blue-600 border-blue-100/50",
    success: "bg-emerald-500/10 text-emerald-600 border-emerald-100/50",
    neutral: "bg-slate-500/10 text-slate-600 border-slate-100/50",
    accent: "bg-amber-500/10 text-amber-600 border-amber-100/50",
  };

  return (
    <Card className="relative overflow-hidden p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${tones[tone]}`}>
          <Icon size={22} />
        </div>
        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
          Actif
        </span>
      </div>
      <div className="mt-4">
        <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</div>
        <div className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{value ?? 0}</div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAdminStatistics()
      .then(({ data }) => setStats(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tableau de bord</h1>
          <p className="text-slate-500 text-sm mt-1">Vue d'ensemble et indicateurs clés de la plateforme SunuDémarche.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
          <p className="text-xs font-medium">Chargement des statistiques...</p>
        </div>
      ) : !stats ? (
        <Card className="p-12 text-center rounded-2xl border border-slate-100 shadow-sm bg-white">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-700 font-semibold text-sm">Aucune donnée disponible</p>
          <p className="text-slate-400 text-xs mt-1">Impossible de récupérer les statistiques pour le moment.</p>
        </Card>
      ) : (
        <>
          {/* Grille de statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon={FileText} label="Demandes totales" value={stats.total_requests} tone="neutral" />
            <StatCard icon={Clock} label="En attente" value={stats.pending_requests} tone="primary" />
            <StatCard icon={Users} label="Citoyens inscrits" value={stats.total_citizens} tone="accent" />
            <StatCard icon={UserCog} label="Agents actifs" value={stats.total_agents} tone="success" />
          </div>

          {/* Section Répartition */}
          <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Répartition par statut</h2>
                  <p className="text-slate-500 text-xs mt-0.5">État d'avancement global des dossiers administratifs</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(stats.requests_by_status || {}).map(([status, count]) => {
                const percentage = stats.total_requests ? (count / stats.total_requests) * 100 : 0;
                return (
                  <div key={status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">{status}</span>
                      <span className="font-bold text-slate-900">
                        {count} <span className="text-slate-400 font-normal text-xs">({percentage.toFixed(1)}%)</span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}