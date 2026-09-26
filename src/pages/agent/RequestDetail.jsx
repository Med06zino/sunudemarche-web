import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, FileText, History, CheckCircle, XCircle, AlertTriangle, Play, ShieldAlert, Send } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Button, Textarea, Alert } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

const NEXT_ACTIONS = {
  SOUMISE: [{ status: "EN_VERIFICATION", label: "Démarrer la vérification", variant: "primary", icon: Play }],
  EN_VERIFICATION: [
    { status: "EN_TRAITEMENT", label: "Passer en traitement", variant: "primary", icon: CheckCircle },
    { status: "CORRECTION_DEMANDEE", label: "Demander une correction", variant: "outline", needsComment: true, icon: AlertTriangle },
    { status: "REFUSEE", label: "Refuser la demande", variant: "danger", needsReason: true, icon: XCircle },
  ],
  EN_TRAITEMENT: [
    { status: "VALIDEE", label: "Valider la demande", variant: "primary", icon: CheckCircle },
    { status: "CORRECTION_DEMANDEE", label: "Demander une correction", variant: "outline", needsComment: true, icon: AlertTriangle },
    { status: "REFUSEE", label: "Refuser la demande", variant: "danger", needsReason: true, icon: XCircle },
  ],
  VALIDEE: [{ status: "DOCUMENT_DISPONIBLE", label: "Marquer document disponible", variant: "secondary", icon: FileText }],
};

export default function AgentRequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    api.getAgentRequest(id).then(({ data }) => setRequest(data)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function handleAction(action) {
    if ((action.needsComment || action.needsReason) && !pendingAction) {
      setPendingAction(action);
      setNote("");
      return;
    }
    if ((action.needsComment || action.needsReason) && !note.trim()) {
      return;
    }
    
    setSubmitting(true);
    setError("");
    try {
      const payload = { target_status: action.status };
      if (action.needsComment) payload.comment = note;
      if (action.needsReason) payload.reason = note;
      await api.changeRequestStatus(id, payload);
      setNote("");
      setPendingAction(null);
      load();
    } catch (err) {
      setError(err.response?.data?.errors?.detail || "Action impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
        <p className="text-sm font-medium">Chargement du dossier...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <p className="text-slate-700 font-semibold text-base mb-4">Demande introuvable.</p>
        <Link to="/agent/demandes">
          <Button variant="outline" className="rounded-xl">Retour aux demandes</Button>
        </Link>
      </div>
    );
  }

  const actions = NEXT_ACTIONS[request.status] || [];

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Fil d'ariane & En-tête */}
      <div>
        <Link to="/agent/demandes" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-4">
          <ArrowLeft size={14} /> Retour à la liste des demandes
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{request.reference}</h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Demandeur : <strong className="text-slate-700 font-semibold">{request.citizen_full_name}</strong> — Service : <span className="text-slate-600">{request.service?.name}</span>
            </p>
          </div>
        </div>
      </div>

      {error && <Alert variant="error" className="rounded-xl border border-red-100 shadow-sm">{error}</Alert>}

      {/* Grille principale : Formulaire & Historique */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Formulaire soumis */}
        <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText size={18} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Données du formulaire soumis</h3>
          </div>

          <div className="space-y-3 text-sm">
            {Object.entries(request.form_data || {}).length === 0 ? (
              <p className="text-slate-400 text-xs italic">Aucune donnée renseignée.</p>
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

        {/* Historique du dossier */}
        <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <History size={18} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Historique des modifications</h3>
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
                      {h.previous_status ? `${h.previous_status} → ${h.new_status}` : h.new_status}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(h.created_at).toLocaleString("fr-FR")} {h.changed_by_name && `• ${h.changed_by_name}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

      {/* Panneau d'actions de traitement agent */}
      {actions.length > 0 && (
        <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldAlert size={18} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Actions de traitement disponibles</h3>
          </div>

          {/* Formulaire de saisie conditionnel (correction / refus) */}
          {pendingAction && (
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-3">
              <label className="block text-xs font-bold text-amber-900">
                {pendingAction.needsReason ? "Motif du refus (obligatoire) :" : "Explication de la correction demandée (obligatoire) :"}
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Précisez les instructions ou motifs..."
                rows={3}
                className="rounded-xl border-amber-200 bg-white text-sm"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button 
                  variant="ghost" 
                  onClick={() => { setPendingAction(null); setNote(""); }}
                  className="rounded-lg text-slate-600 hover:bg-slate-100 text-xs"
                >
                  Annuler
                </Button>
                <Button 
                  variant={pendingAction.variant === "danger" ? "danger" : "primary"}
                  disabled={submitting || !note.trim()}
                  onClick={() => handleAction(pendingAction)}
                  className="rounded-lg text-xs"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Send size={14} className="mr-1.5" />}
                  Confirmer l'action
                </Button>
              </div>
            </div>
          )}

          {/* Boutons d'actions standards */}
          {!pendingAction && (
            <div className="flex flex-wrap gap-3">
              {actions.map((action) => {
                const IconComponent = action.icon || Play;
                return (
                  <Button
                    key={action.status}
                    variant={action.variant}
                    disabled={submitting}
                    onClick={() => handleAction(action)}
                    className="rounded-xl font-medium text-xs px-4 py-2.5 flex items-center gap-2 shadow-sm"
                  >
                    <IconComponent size={15} />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}