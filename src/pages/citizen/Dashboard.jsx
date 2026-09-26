import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle2, Plus, ChevronRight, Loader2, Sparkles } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Button } from "../../components/ui";
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

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listRequests()
      .then(({ data }) => {
        const results = data.results || data.data || data;
        setRequests(Array.isArray(results) ? results : []);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des demandes :", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const active = requests.filter((r) => !["RECUPEREE", "REFUSEE", "ANNULEE"].includes(r.status));
  const availableDocs = requests.filter((r) => r.status === "DOCUMENT_DISPONIBLE");

  return (
    <div className="space-y-8 pb-10">
      {/* En-tête du Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bonjour {user?.first_name || "Citoyen"} 
          </h1>
          <p className="text-slate-500 text-sm mt-1">Voici un aperçu de vos démarches administratives et de leur suivi en temps réel.</p>
        </div>
        <Link to="/citoyen/nouvelle-demande">
          <Button className="flex items-center gap-2 shadow-sm bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2.5 rounded-xl transition-all">
            <Plus size={18} /> 
            Nouvelle demande
          </Button>
        </Link>
      </div>

      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard icon={FileText} label="Total des demandes" value={requests.length} tone="neutral" />
        <StatCard icon={Clock} label="En cours de traitement" value={active.length} tone="primary" />
        <StatCard icon={CheckCircle2} label="Documents disponibles" value={availableDocs.length} tone="success" />
      </div>

      {/* Liste des Demandes Récentes */}
      <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Demandes récentes</h2>
            <p className="text-slate-500 text-xs mt-0.5">Vos dernières soumissions sur la plateforme</p>
          </div>
          {requests.length > 5 && (
            <Link to="/citoyen/demandes" className="text-xs font-semibold text-primary hover:underline">
              Voir tout ({requests.length})
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin mb-2 text-primary" />
            <p className="text-xs">Chargement de vos démarches...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">Vous n'avez pas encore de demande.</p>
            <p className="text-slate-400 text-xs mt-1">Commencez par créer votre première démarche administrative en quelques clics.</p>
            <Link to="/citoyen/nouvelle-demande" className="inline-block mt-4">
              <Button size="sm" variant="outline" className="rounded-xl">Faire une demande</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.slice(0, 5).map((r) => (
              <Link
                key={r.id}
                to={`/citoyen/demandes/${r.id}`}
                className="flex items-center justify-between py-4 hover:bg-slate-50/80 -mx-4 px-4 rounded-xl transition-all duration-200 group"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors">
                    {r.reference || `Demande #${r.id}`}
                  </div>
                  <div className="text-xs text-slate-500">
                    {r.service_name || r.service?.name || "Service citoyen"}
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

