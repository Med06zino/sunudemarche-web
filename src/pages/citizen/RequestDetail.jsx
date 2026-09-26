import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, FileText, History, AlertCircle, CheckCircle2, Send, Building, MapPin } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Button, Textarea, Alert } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

const STATUS_LABELS = {
  BROUILLON: "Brouillon", SOUMISE: "Soumise", EN_VERIFICATION: "En vérification",
  EN_TRAITEMENT: "En traitement", VALIDEE: "Validée", DOCUMENT_DISPONIBLE: "Document disponible",
  RECUPEREE: "Récupérée", CORRECTION_DEMANDEE: "Correction demandée", REFUSEE: "Refusée", ANNULEE: "Annulée",
};

export default function RequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [correctionData, setCorrectionData] = useState({});

  function load() {
    api.getRequest(id).then(({ data }) => {
      setRequest(data);
      setCorrectionData(data.form_data || {});
    }).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function handleSubmitDraft() {
    setSubmitting(true);
    setError("");
    try {
      await api.submitRequest(id);
      load();
    } catch (err) {
      setError(err.response?.data?.errors?.detail || "Impossible de soumettre la demande.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResubmitCorrection() {
    setSubmitting(true);
    setError("");
    try {
      await api.updateRequest(id, { form_data: correctionData });
      await api.submitRequest(id);
      load();
    } catch (err) {
      setError(err.response?.data?.errors?.detail || "Impossible de renvoyer la demande.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
        <p className="text-sm font-medium">Chargement des détails de la demande...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <p className="text-slate-700 font-semibold text-base mb-4">Demande introuvable.</p>
        <Link to="/citoyen/demandes">
          <Button variant="outline" className="rounded-xl">Retour à mes demandes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      {/* Fil d'ariane & En-tête */}
      <div>
        <Link to="/citoyen/demandes" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-4">
          <ArrowLeft size={14} /> Retour à mes demandes
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{request.reference}</h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2 flex-wrap">
              <span className="font-medium text-slate-700 flex items-center gap-1">
                <Building size={14} className="text-slate-400" /> {request.service?.name}
              </span>
              <span>—</span>
              <span className="text-slate-500 flex items-center gap-1">
                <MapPin size={14} className="text-slate-400" /> {request.center?.name}
              </span>
            </p>
          </div>
        </div>
      </div>

      {error && <Alert variant="error" className="rounded-xl border border-red-100 shadow-sm">{error}</Alert>}

      {/* État : Brouillon */}
      {request.status === "BROUILLON" && (
        <Card className="p-6 rounded-2xl border border-amber-100 bg-amber-50/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-900">Demande en brouillon</h3>
            <p className="text-xs text-amber-700">Cette demande n'a pas encore été transmise. Soumettez-la pour lancer son traitement par les services.</p>
          </div>
          <Button 
            onClick={handleSubmitDraft} 
            disabled={submitting}
            className="rounded-xl bg-primary hover:bg-primary/90 text-white font-medium shadow-sm shrink-0"
          >
            {submitting ? <Loader2 size={16} className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
            Soumettre la demande
          </Button>
        </Card>
      )}

      {/* État : Correction demandée */}
      {request.status === "CORRECTION_DEMANDEE" && (
        <div className="space-y-6">
          <Alert variant="warning" className="rounded-xl border border-amber-200 shadow-sm">
            <span className="font-semibold block mb-1">Note de correction de l'administration :</span>
            {request.correction_note}
          </Alert>

          <Card className="p-8 rounded-2xl border border-slate-100 shadow-sm bg-white space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Corrigez votre formulaire</h3>
              <p className="text-slate-500 text-xs mt-0.5">Mettez à jour les informations ci-dessous puis renvoyez votre dossier.</p>
            </div>
            
            <div className="space-y-4">
              {Object.keys(correctionData).map((key) => (
                <div key={key} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">{key}</label>
                  <Textarea
                    value={correctionData[key] || ""}
                    onChange={(e) => setCorrectionData({ ...correctionData, [key]: e.target.value })}
                    rows={2}
                    className="rounded-xl border-slate-200 text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button 
                onClick={handleResubmitCorrection} 
                disabled={submitting}
                className="rounded-xl bg-primary hover:bg-primary/90 text-white font-medium px-6 shadow-sm"
              >
                {submitting ? <Loader2 size={16} className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
                Renvoyer la demande corrigée
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* État : Refusée */}
      {request.status === "REFUSEE" && (
        <Alert variant="error" className="rounded-xl border border-red-100 shadow-sm">
          <span className="font-semibold block mb-1">Motif du refus :</span>
          {request.rejection_reason || "Votre demande n'a pas pu aboutir."}
        </Alert>
      )}

      {/* État : Document disponible */}
      {request.status === "DOCUMENT_DISPONIBLE" && (
        <Alert variant="success" className="rounded-xl border border-emerald-100 shadow-sm">
          <span className="font-semibold block mb-1">Document prêt !</span>
          Votre document est disponible. Rendez-vous au centre <strong className="font-bold">{request.center?.name}</strong> muni de votre pièce d'identité pour le récupérer.
        </Alert>
      )}

      {/* Grille principale d'informations & historique */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Informations de la demande */}
        <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText size={18} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Informations de la demande</h3>
          </div>

          <div className="space-y-3 text-sm">
            {Object.entries(request.form_data || {}).length === 0 ? (
              <p className="text-slate-400 text-xs italic">Aucune information additionnelle.</p>
            ) : (
              Object.entries(request.form_data || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <span className="text-slate-500 font-medium text-xs">{key}</span>
                  <span className="text-slate-900 font-semibold text-right">{value || "—"}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Historique des statuts */}
        <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <History size={18} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Historique du dossier</h3>
          </div>

          <div className="space-y-4 pl-2">
            {(!request.status_history || request.status_history.length === 0) ? (
              <p className="text-slate-400 text-xs italic">Aucun historique disponible.</p>
            ) : (
              request.status_history.map((h, index) => (
                <div key={h.id || index} className="flex gap-3 relative pb-4 last:pb-0">
                  {index < request.status_history.length - 1 && (
                    <div className="absolute left-[5px] top-4 w-0.5 h-full bg-slate-100" />
                  )}
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0 ring-4 ring-primary/10" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">
                      {STATUS_LABELS[h.new_status] || h.new_status}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(h.created_at).toLocaleString("fr-FR")} {h.changed_by_name && `• ${h.changed_by_name}`}
                    </div>
                    {h.comment && <div className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">{h.comment}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}