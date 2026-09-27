import { useEffect, useState } from "react";
import { FileText, Clock, Users, UserCog, Loader2, BarChart3, TrendingUp } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, PageLoader, Alert } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

const STATUS_LABEL = {
  BROUILLON: "Brouillon", SOUMISE: "Soumise", EN_VERIFICATION: "En vérification",
  EN_TRAITEMENT: "En traitement", VALIDEE: "Validée", DOCUMENT_DISPONIBLE: "Document disponible",
  RECUPEREE: "Récupérée", CORRECTION_DEMANDEE: "Correction demandée", REFUSEE: "Refusée", ANNULEE: "Annulée",
};

const STATUS_COLORS = {
  BROUILLON: "bg-slate-400", SOUMISE: "bg-blue-400", EN_VERIFICATION: "bg-amber-400",
  EN_TRAITEMENT: "bg-orange-400", VALIDEE: "bg-emerald-500", DOCUMENT_DISPONIBLE: "bg-teal-500",
  RECUPEREE: "bg-slate-500", CORRECTION_DEMANDEE: "bg-amber-500", REFUSEE: "bg-red-500", ANNULEE: "bg-slate-300",
};

function StatCard({ icon: Icon, label, value, sublabel, tone }) {
  const tones = {
    blue:   "bg-blue-500/10 text-blue-600 border-blue-100",
    green:  "bg-emerald-500/10 text-emerald-600 border-emerald-100",
    slate:  "bg-slate-100 text-slate-500 border-slate-200",
    amber:  "bg-amber-500/10 text-amber-600 border-amber-100",
  };
  return (
    <Card className="p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 ${tones[tone] ?? tones.slate}`}>
        <Icon size={20} />
      </div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value ?? 0}</p>
      {sublabel && <p className="text-[11px] text-slate-400 mt-1">{sublabel}</p>}
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getAdminStatistics()
      .then(({ data }) => setStats(data.data || data))
      .catch(() => setError("Impossible de charger les statistiques."))
      .finally(() => setLoading(false));
  }, []);

  const byStatus = stats?.requests_by_status
    ? Object.entries(stats.requests_by_status).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="space-y-6 pb-10 animate-fade-in">

      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tableau de bord</h1>
        <p className="text-slate-500 text-sm mt-1">Vue d'ensemble et indicateurs clés de la plateforme.</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <PageLoader message="Chargement des statistiques..." />
      ) : !stats ? null : (
        <>
          {/* Cartes stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FileText} label="Demandes totales"  value={stats.total_requests}   tone="slate" />
            <StatCard icon={Clock}    label="En attente"        value={stats.pending_requests}  tone="blue"  sublabel="hors états finaux" />
            <StatCard icon={Users}    label="Citoyens inscrits" value={stats.total_citizens}    tone="amber" />
            <StatCard icon={UserCog}  label="Agents actifs"     value={stats.total_agents}      tone="green" />
          </div>

          {/* Graphe par statut */}
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center">
                <BarChart3 size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Répartition par statut</h2>
                <p className="text-xs text-slate-400 mt-0.5">État d'avancement global des dossiers</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {byStatus.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-6">Aucune donnée disponible.</p>
              ) : (
                byStatus.map(([status, count]) => {
                  const pct = stats.total_requests ? (count / stats.total_requests) * 100 : 0;
                  const bar = STATUS_COLORS[status] || "bg-slate-300";
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${bar}`} />
                          <span className="font-semibold text-slate-700">{STATUS_LABEL[status] || status}</span>
                        </div>
                        <span className="text-slate-500 font-semibold tabular-nums">
                          {count}
                          <span className="text-slate-400 font-normal text-xs ml-1.5">({pct.toFixed(0)}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${bar}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
