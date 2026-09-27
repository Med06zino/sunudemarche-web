import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronRight, Calendar, Plus, FolderOpen } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Select, Button, PageLoader, EmptyState } from "../../components/ui";
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
      .then(({ data }) => setRequests(data.results || data.data || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? requests.filter((r) => r.status === filter) : requests;

  return (
    <div className="max-w-4xl space-y-6 pb-10 animate-fade-in">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mes demandes</h1>
          <p className="text-slate-500 text-sm mt-1">
            Historique et suivi de toutes vos démarches administratives.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-52 text-sm py-2"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
          <Link to="/citoyen/nouvelle-demande">
            <Button size="sm" className="shrink-0">
              <Plus size={15} /> Nouvelle
            </Button>
          </Link>
        </div>
      </div>

      {/* Liste */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <PageLoader message="Chargement de vos demandes..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title={filter ? "Aucune demande avec ce statut" : "Aucune demande"}
            description={filter ? "Changez le filtre pour voir d'autres résultats." : "Vous n'avez pas encore effectué de démarche."}
            action={
              !filter && (
                <Link to="/citoyen/nouvelle-demande">
                  <Button size="sm" variant="outline">Faire ma première demande</Button>
                </Link>
              )
            }
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((r) => (
              <Link
                key={r.id}
                to={`/citoyen/demandes/${r.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">
                    {r.reference}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {r.service_name}
                    {r.center_name && <> · <span className="text-slate-500 font-medium">{r.center_name}</span></>}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 shrink-0">
                  <Calendar size={12} />
                  {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </div>

                <StatusBadge status={r.status} />

                <ChevronRight size={15} className="text-slate-300 group-hover:text-primary transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {/* Compteur */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              {filtered.length} demande{filtered.length > 1 ? "s" : ""}
              {filter ? " (filtrée)" : ""}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
