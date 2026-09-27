import { useEffect, useState } from "react";
import { FileText, Calendar, Building2, User, FolderOpen } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Select, PageLoader, EmptyState } from "../../components/ui";
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

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    api.listAdminRequests(filter ? { status: filter } : {})
      .then(({ data }) => setRequests(data.results || data.data || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-5xl space-y-6 pb-10 animate-fade-in">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Toutes les demandes</h1>
          <p className="text-slate-500 text-sm mt-1">Supervision de l'ensemble des dossiers administratifs.</p>
        </div>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-52 text-sm py-2"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <PageLoader message="Chargement des dossiers..." />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Aucune demande trouvée"
            description={filter ? "Aucun dossier ne correspond à ce statut." : "Aucun dossier enregistré pour le moment."}
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900">{r.reference}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 flex-wrap">
                    <span className="font-medium text-slate-600">{r.service_name}</span>
                    {r.center_name && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Building2 size={11} className="text-slate-400" /> {r.center_name}
                        </span>
                      </>
                    )}
                    {r.citizen_full_name && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <User size={11} className="text-slate-400" /> {r.citizen_full_name}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {r.created_at && (
                  <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 shrink-0">
                    <Calendar size={11} />
                    {new Date(r.created_at).toLocaleDateString("fr-FR")}
                  </div>
                )}

                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
        {!loading && requests.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
            <p className="text-xs text-slate-400">{requests.length} dossier{requests.length > 1 ? "s" : ""}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
