import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ListChecks, CheckCircle2, ChevronRight, Building } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = {
    primary: "bg-blue-500/10 text-blue-600 border-blue-100/50",
    success: "bg-emerald-500/10 text-emerald-600 border-emerald-100/50",
    neutral: "bg-slate-500/10 text-slate-600 border-slate-100/50",
  };

  return (
    <Card className="relative overflow-hidden p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${tones[tone]}`}>
          <Icon size={22} />
        </div>
        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          Actif
        </span>
      </div>
      <div className="mt-4">
        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</div>
        <div className="text-3xl font-bold text-slate-900 mt-1">{value ?? 0}</div>
      </div>
    </Card>
  );
}

export default function AgentDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.listAgentRequests()
      .then(({ data }) => {
        setRequests(data.results || data || []);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des demandes agent :", err);
        setError("Impossible de charger les demandes.");
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = requests.filter((r) => ["EN_VERIFICATION", "EN_TRAITEMENT"].includes(r.status));
  const validatedCount = requests.filter((r) => ["VALIDEE", "DOCUMENT_DISPONIBLE", "RECUPEREE"].includes(r.status)).length;

  return (
    <div className="space-y-8 pb-10">
      {/* En-tête personnalisé */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bonjour {user?.first_name || user?.email || "Agent"} 
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
            <Building size={16} className="text-primary" />
            <span>Centre : <strong className="text-slate-700">{user?.agent_profile?.center_name || user?.center_name || "—"}</strong></span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard icon={FileText} label="Demandes totales" value={requests.length} tone="neutral" />
        <StatCard icon={ListChecks} label="À traiter" value={pending.length} tone="primary" />
        <StatCard icon={CheckCircle2} label="Validées" value={validatedCount} tone="success" />
      </div>

      {/* Section des demandes à traiter */}
      <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Demandes à traiter en priorité</h2>
            <p className="text-slate-500 text-xs mt-0.5">Dossiers nécessitant une action rapide de votre part</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary"></div>
          </div>
        ) : pending.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">Aucune demande en attente pour le moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pending.slice(0, 8).map((r) => (
              <Link
                key={r.id}
                to={`/agent/demandes/${r.id}`}
                className="flex items-center justify-between py-4 hover:bg-slate-50/80 -mx-4 px-4 rounded-xl group transition-all duration-200"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors">
                    {r.reference || `Demande #${r.id}`}
                  </div>
                  <div className="text-xs text-slate-500">
                    {r.service_name || r.service?.name || "Service général"}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={r.status} />
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
