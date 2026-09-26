import { useEffect, useState } from "react";
import { FileText, Loader2, Inbox, Calendar, Building2, User, Filter } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Select } from "../../components/ui";
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
      .then(({ data }) => setRequests(data.results || data))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-5xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Toutes les demandes</h1>
          <p className="text-slate-500 text-sm mt-1">Supervisez l'ensemble des dossiers administratifs enregistrés sur la plateforme.</p>
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
            <p className="text-xs">Chargement des dossiers...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">Aucune demande trouvée</p>
            <p className="text-slate-400 text-xs mt-1">Aucun dossier ne correspond au filtre sélectionné.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-4 -mx-4 px-4 rounded-xl hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{r.reference}</div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-slate-700">{r.service_name}</span>
                      {r.center_name && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <Building2 size={12} className="text-slate-400" /> {r.center_name}
                          </span>
                        </>
                      )}
                      {r.citizen_full_name && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <User size={12} className="text-slate-400" /> {r.citizen_full_name}
                          </span>
                        </>
                      )}
                    </div>
                    {r.created_at && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 sm:hidden">
                        <Calendar size={12} />
                        <span>{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {r.created_at && (
                    <div className="text-right hidden sm:block">
                      <span className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                        <Calendar size={12} />
                        {new Date(r.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}


  return (
    <div className="max-w-4xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Toutes les demandes</h1>
          <p className="text-slate-500 text-sm mt-1">Supervisez l'ensemble des dossiers administratifs enregistrés sur la plateforme.</p>
        </div>
      </div>

      {/* Carte Liste */}
      <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin mb-2 text-primary" />
            <p className="text-xs">Chargement des dossiers...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">Aucune demande trouvée</p>
            <p className="text-slate-400 text-xs mt-1">Aucun dossier n'est enregistré pour le moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-4 -mx-4 px-4 rounded-xl hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {r.reference}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-slate-700">{r.service_name}</span>
                      {r.center_name && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <Building2 size={12} className="text-slate-400" /> {r.center_name}
                          </span>
                        </>
                      )}
                    </div>
                    {r.created_at && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 sm:hidden">
                        <Calendar size={12} />
                        <span>{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {r.created_at && (
                    <div className="text-right hidden sm:block">
                      <span className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                        <Calendar size={12} />
                        {new Date(r.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}