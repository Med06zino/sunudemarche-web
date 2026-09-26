import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronRight, Loader2, Inbox, Calendar, Search } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Select, EmptyState } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

const STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "BROUILLON", label: "Brouillon" },
  { value: "SOUMISE", label: "Soumise" },
  { value: "EN_VERIFICATION", label: "En vérification" },
  { value: "EN_TRAITEMENT", label: "En traitement" },
  { value: "VALIDEE", label: "Validée" },
  { value: "DOCUMENT_DISPONIBLE", label: "Document disponible" },
  { value: "RECUPEREE", label: "Récupérée" },
  { value: "CORRECTION_DEMANDEE", label: "Correction demandée" },
  { value: "REFUSEE", label: "Refusée" },
  { value: "ANNULEE", label: "Annulée" },
];

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.listRequests()
      .then(({ data }) => setRequests(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? requests.filter((r) => r.status === filter) : requests;

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mes demandes</h1>
          <p className="text-slate-500 text-sm mt-1">Retrouvez l'historique et l'état d'avancement de vos démarches administratives.</p>
        </div>
        <div className="w-full sm:w-64">
          <Select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border-slate-200 text-sm py-2 shadow-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Carte Liste */}
      <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin mb-2 text-primary" />
            <p className="text-xs">Chargement de vos demandes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">Aucune demande trouvée.</p>
            <p className="text-slate-400 text-xs mt-1">Vos nouvelles démarches apparaîtront ici une fois créées.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <Link
                key={r.id}
                to={`/citoyen/demandes/${r.id}`}
                className="flex items-center justify-between py-4 -mx-4 px-4 rounded-xl hover:bg-slate-50/80 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors flex items-center gap-2">
                      {r.reference}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {r.service_name} <span className="text-slate-300 mx-1">•</span> <span className="text-slate-600 font-medium">{r.center_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 sm:hidden">
                      <Calendar size={12} />
                      <span>{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                      <Calendar size={12} />
                      {new Date(r.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <StatusBadge status={r.status} />
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}