import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle2, Plus, ChevronRight, Sparkles, FolderOpen } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Button, PageLoader, EmptyState } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

function StatCard({ icon: Icon, label, value, tone, sublabel }) {
  const tones = {
    blue:   { wrap: "bg-blue-500/10 text-blue-600 border-blue-100",    val: "text-blue-700" },
    green:  { wrap: "bg-emerald-500/10 text-emerald-600 border-emerald-100", val: "text-emerald-700" },
    slate:  { wrap: "bg-slate-100 text-slate-500 border-slate-200",    val: "text-slate-700" },
    amber:  { wrap: "bg-amber-500/10 text-amber-600 border-amber-100", val: "text-amber-700" },
  };
  const t = tones[tone] ?? tones.slate;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${t.wrap}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-extrabold tracking-tight ${t.val}`}>{value ?? 0}</p>
      {sublabel && <p className="text-[11px] text-slate-400 mt-1">{sublabel}</p>}
    </Card>
  );
}

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listRequests()
      .then(({ data }) => {
        const r = data.results || data.data || data;
        setRequests(Array.isArray(r) ? r : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const inProgress = requests.filter(
    (r) => !["RECUPEREE", "REFUSEE", "ANNULEE", "BROUILLON"].includes(r.status)
  );
  const available = requests.filter((r) => r.status === "DOCUMENT_DISPONIBLE");
  const recent = requests.slice(0, 5);

  return (
    <div className="space-y-8 pb-10 animate-fade-in">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* <Sparkles size={16} className="text-amber-400" /> */}
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bienvenue</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Bonjour, {user?.first_name || "Citoyen"} 
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Voici un aperçu de vos démarches administratives.
          </p>
        </div>
        <Link to="/citoyen/nouvelle-demande">
          <Button size="sm" className="shadow-sm shadow-primary/20 shrink-0">
            <Plus size={16} /> Nouvelle demande
          </Button>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={FileText}     label="Total"            value={requests.length} tone="slate" sublabel="toutes les demandes" />
        <StatCard icon={Clock}        label="En cours"         value={inProgress.length} tone="blue" sublabel="en attente de traitement" />
        <StatCard icon={CheckCircle2} label="Docs disponibles" value={available.length}  tone="green" sublabel="à récupérer" />
      </div>

      {/* Alerte documents disponibles */}
      {available.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-slide-up">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-800">
              {available.length} document{available.length > 1 ? "s" : ""} prêt{available.length > 1 ? "s" : ""} à récupérer
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">
              Rendez-vous au centre concerné muni de votre pièce d'identité.
            </p>
          </div>
          <Link to="/citoyen/demandes">
            <Button size="sm" variant="secondary" className="shrink-0 text-xs">Voir</Button>
          </Link>
        </div>
      )}

      {/* Demandes récentes */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Demandes récentes</h2>
            <p className="text-xs text-slate-400 mt-0.5">Vos 5 dernières soumissions</p>
          </div>
          {requests.length > 5 && (
            <Link to="/citoyen/demandes">
              <Button size="sm" variant="ghost" className="text-xs gap-1">
                Tout voir <ChevronRight size={13} />
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <PageLoader message="Chargement de vos demandes..." />
        ) : recent.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Aucune demande pour le moment"
            description="Commencez dès maintenant en créant votre première démarche administrative."
            action={
              <Link to="/citoyen/nouvelle-demande">
                <Button size="sm" variant="outline">Faire une demande</Button>
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {recent.map((r) => (
              <Link
                key={r.id}
                to={`/citoyen/demandes/${r.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors truncate">
                      {r.reference}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {r.service_name || "Service administratif"} · {r.center_name || "Centre"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
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
