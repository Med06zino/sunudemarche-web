import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ListChecks, CheckCircle2, ChevronRight, Building2, AlertCircle } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, PageLoader, Alert } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = {
    blue:  "bg-blue-500/10 text-blue-600 border-blue-100",
    green: "bg-emerald-500/10 text-emerald-600 border-emerald-100",
    slate: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <Card className="p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 ${tones[tone] ?? tones.slate}`}>
        <Icon size={20} />
      </div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value ?? 0}</p>
    </Card>
  );
}

export default function AgentDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listAgentRequests()
      .then(({ data }) => setRequests(data.results || data.data || data || []))
      .catch(() => setError("Impossible de charger les demandes."))
      .finally(() => setLoading(false));
  }, []);

  const pending = requests.filter((r) => ["EN_VERIFICATION", "EN_TRAITEMENT"].includes(r.status));
  const validated = requests.filter((r) => ["VALIDEE", "DOCUMENT_DISPONIBLE", "RECUPEREE"].includes(r.status)).length;

  return (
    <div className="space-y-6 pb-10 animate-fade-in">

      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Bonjour, {user?.first_name || "Agent"}
        </h1>
        <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
          <Building2 size={14} className="text-primary" />
          <span>Centre : <strong className="text-slate-700">{user?.agent_profile?.center_name || "—"}</strong></span>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={FileText}     label="Demandes totales" value={requests.length}   tone="slate" />
        <StatCard icon={ListChecks}   label="À traiter"        value={pending.length}    tone="blue" />
        <StatCard icon={CheckCircle2} label="Validées"         value={validated}         tone="green" />
      </div>

      {/* Demandes prioritaires */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Demandes à traiter</h2>
            <p className="text-xs text-slate-400 mt-0.5">En vérification + en traitement</p>
          </div>
          {pending.length > 0 && (
            <Link to="/agent/demandes">
              <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Tout voir <ChevronRight size={13} />
              </button>
            </Link>
          )}
        </div>

        {loading ? (
          <PageLoader message="Chargement..." />
        ) : pending.length === 0 ? (
          <div className="text-center py-12 px-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
            <p className="font-bold text-slate-600 text-sm">Aucune demande en attente</p>
            <p className="text-xs text-slate-400 mt-1">Tout est traité. Bien joué !</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {pending.slice(0, 8).map((r) => (
              <Link
                key={r.id}
                to={`/agent/demandes/${r.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors truncate">
                    {r.reference}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {r.service_name || "Service"}{r.citizen_full_name ? ` · ${r.citizen_full_name}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={r.status} />
                  <ChevronRight size={15} className="text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
