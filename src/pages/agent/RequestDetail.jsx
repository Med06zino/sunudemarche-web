import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, FileText, History, CheckCircle, XCircle,
  AlertTriangle, Play, ShieldCheck, Send, Loader2, AlertCircle,
  Upload, CheckCircle2, Copy, Bell,
} from "lucide-react";
import toast from "react-hot-toast";
import * as api from "../../api/endpoints";
import { Card, Button, Textarea, Alert, PageLoader, Badge } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

const STATUS_LABELS = {
  BROUILLON: "Brouillon", SOUMISE: "Soumise", EN_VERIFICATION: "En vérification",
  EN_TRAITEMENT: "En traitement", VALIDEE: "Validée", DOCUMENT_DISPONIBLE: "Document disponible",
  RECUPEREE: "Récupérée", CORRECTION_DEMANDEE: "Correction demandée",
  REFUSEE: "Refusée", ANNULEE: "Annulée",
};

const FIELD_LABELS = {
  full_name: "Nom complet", date_of_birth: "Date de naissance",
  place_of_birth: "Lieu de naissance", father_full_name: "Nom du père",
  mother_full_name: "Nom de la mère", reason: "Motif",
};

const NEXT_ACTIONS = {
  SOUMISE: [
    { status: "EN_VERIFICATION", label: "Démarrer la vérification", variant: "primary", icon: Play },
  ],
  EN_VERIFICATION: [
    { status: "EN_TRAITEMENT", label: "Passer en traitement", variant: "primary", icon: CheckCircle },
    { status: "CORRECTION_DEMANDEE", label: "Demander une correction", variant: "outline", needsComment: true, icon: AlertTriangle },
    { status: "REFUSEE", label: "Refuser", variant: "danger", needsReason: true, icon: XCircle },
  ],
  EN_TRAITEMENT: [
    { status: "VALIDEE", label: "Valider la demande", variant: "primary", icon: CheckCircle },
    { status: "CORRECTION_DEMANDEE", label: "Demander une correction", variant: "outline", needsComment: true, icon: AlertTriangle },
    { status: "REFUSEE", label: "Refuser", variant: "danger", needsReason: true, icon: XCircle },
  ],
  VALIDEE: [
    { status: "DOCUMENT_DISPONIBLE", label: "Marquer document disponible", variant: "secondary", icon: FileText },
  ],
};

const CHANNEL_LABELS = {
  INTERNAL: "Interne", EMAIL: "Email", SMS: "SMS", WHATSAPP: "WhatsApp",
};

export default function AgentRequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  function load() {
    api.getAgentRequest(id)
      .then(({ data }) => setRequest(data.data || data))
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function handleAction(action) {
    if ((action.needsComment || action.needsReason) && !pendingAction) {
      setPendingAction(action); setNote(""); return;
    }
    if ((action.needsComment || action.needsReason) && !note.trim()) return;

    setSubmitting(true); setError("");
    try {
      const payload = { target_status: action.status };
      if (action.needsComment) payload.comment = note;
      if (action.needsReason)  payload.reason  = note;
      await api.changeRequestStatus(id, payload);
      setPendingAction(null); setNote("");
      load();
    } catch (err) {
      setError(
        err.response?.data?.errors?.detail ||
        err.response?.data?.detail ||
        "Action impossible. Vérifiez que la transition est autorisée."
      );
    } finally { setSubmitting(false); }
  }

  async function handleOfficialDocUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await api.uploadOfficialDocument(id, fd);
      toast.success("Document officiel déposé avec succès.");
      load();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.detail ||
        err.response?.data?.detail ||
        "Échec de l'envoi du document.";
      toast.error(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (loading) return <PageLoader message="Chargement du dossier..." />;

  if (!request) return (
    <div className="text-center py-16">
      <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
      <p className="font-bold text-slate-700 mb-4">Demande introuvable.</p>
      <Link to="/agent/demandes">
        <Button variant="outline" size="sm">Retour aux demandes</Button>
      </Link>
    </div>
  );

  const actions = NEXT_ACTIONS[request.status] || [];

  return (
    <div className="max-w-4xl space-y-6 pb-10 animate-fade-in">

      {/* Fil d'ariane */}
      <Link to="/agent/demandes" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
        <ArrowLeft size={13} /> Retour aux demandes
      </Link>

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-1.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{request.reference}</h1>
            <StatusBadge status={request.status} size="lg" />
          </div>
          <p className="text-sm text-slate-500">
            Demandeur : <strong className="text-slate-700">{request.citizen_full_name}</strong>
            {" · "} Service : <span className="text-slate-600">{request.service?.name}</span>
          </p>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Grille informations + historique */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <Card className="p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <FileText size={16} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Formulaire soumis</h3>
          </div>
          <div className="px-5 py-4 space-y-2">
            {Object.entries(request.form_data || {}).length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">Aucune donnée renseignée.</p>
            ) : (
              Object.entries(request.form_data || {}).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {FIELD_LABELS[key] || key}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 text-right max-w-[55%] truncate">
                    {val || "—"}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <History size={16} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Historique</h3>
          </div>
          <div className="px-5 py-4">
            {(!request.status_history || request.status_history.length === 0) ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">Aucun historique.</p>
            ) : (
              <div className="space-y-0 relative">
                {request.status_history.map((h, idx) => (
                  <div key={h.id || idx} className="flex gap-3 pb-4 last:pb-0 relative">
                    {idx < request.status_history.length - 1 && (
                      <div className="absolute left-[5px] top-4 bottom-0 w-px bg-slate-100" />
                    )}
                    <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10 shrink-0 mt-1.5 z-10" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {h.previous_status
                          ? `${STATUS_LABELS[h.previous_status] || h.previous_status} → ${STATUS_LABELS[h.new_status] || h.new_status}`
                          : STATUS_LABELS[h.new_status] || h.new_status
                        }
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(h.created_at).toLocaleString("fr-FR")}
                        {h.changed_by_name && ` · ${h.changed_by_name}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Section upload document officiel (VALIDEE / DOCUMENT_DISPONIBLE) ── */}
      {["VALIDEE", "DOCUMENT_DISPONIBLE"].includes(request.status) && (
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <Upload size={16} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Document officiel</h3>
            {request.official_document?.id && (
              <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 size={12} /> Déposé
              </span>
            )}
          </div>
          <div className="p-5 space-y-4">
            {request.official_document?.id ? (
              <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={16} className="text-slate-400 shrink-0" />
                  <span className="text-sm font-semibold text-slate-700 truncate">
                    {request.official_document.filename || "document-officiel"}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="shrink-0 text-xs"
                >
                  {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  Remplacer
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Upload size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600 mb-1">Déposer le document officiel</p>
                <p className="text-xs text-slate-400 mb-4">
                  Fichier PDF ou image (tampon + signature de l'officier).
                  {request.quantity > 1 && (
                    <span className="block mt-0.5 font-medium text-slate-500">
                      {request.quantity} copies physiques à préparer.
                    </span>
                  )}
                </p>
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading
                    ? <><Loader2 size={14} className="animate-spin" /> Envoi en cours...</>
                    : <><Upload size={14} /> Choisir le fichier</>
                  }
                </Button>
              </div>
            )}
            {/* Input masqué */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="sr-only"
              onChange={handleOfficialDocUpload}
              aria-label="Sélectionner le document officiel"
            />
            <p className="text-xs text-slate-400">
              Formats acceptés : PDF, JPG, PNG. Ce fichier sera accessible au citoyen
              pour impression depuis son espace.
            </p>
          </div>
        </Card>
      )}

      {/* ── Infos demande (quantité + canal) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Copies demandées", value: `${request.quantity ?? 1} copie${(request.quantity ?? 1) > 1 ? "s" : ""}`, Icon: Copy },
          { label: "Canal de notif.", value: CHANNEL_LABELS[request.notification_channel] || request.notification_channel, Icon: Bell },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Icon size={14} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
              <p className="text-xs font-bold text-slate-700">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Panel d'actions */}
      {actions.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <ShieldCheck size={16} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Actions disponibles</h3>
          </div>

          <div className="p-5 space-y-4">
            {/* Zone de saisie pour correction/refus */}
            {pendingAction && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3 animate-slide-up">
                <label className="block text-xs font-bold text-amber-800">
                  {pendingAction.needsReason
                    ? "Motif du refus (obligatoire) :"
                    : "Explication de la correction requise (obligatoire) :"}
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Précisez les instructions ou motifs..."
                  rows={3}
                  hint="Ce message sera transmis au citoyen."
                />
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => { setPendingAction(null); setNote(""); }}
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    variant={pendingAction.variant === "danger" ? "danger" : "primary"}
                    disabled={submitting || !note.trim()}
                    onClick={() => handleAction(pendingAction)}
                  >
                    {submitting
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Send size={14} />
                    }
                    Confirmer
                  </Button>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            {!pendingAction && (
              <div className="flex flex-wrap gap-3">
                {actions.map((action) => {
                  const Icon = action.icon || Play;
                  return (
                    <Button
                      key={action.status}
                      variant={action.variant}
                      size="sm"
                      disabled={submitting}
                      onClick={() => handleAction(action)}
                      className="gap-2"
                    >
                      <Icon size={15} />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* État final */}
      {actions.length === 0 && ["RECUPEREE", "REFUSEE", "ANNULEE"].includes(request.status) && (
        <Alert variant={request.status === "REFUSEE" ? "error" : "info"}>
          Ce dossier est clôturé ({STATUS_LABELS[request.status]}).
          {request.rejection_reason && <span className="block mt-1 font-semibold">Motif : {request.rejection_reason}</span>}
        </Alert>
      )}
    </div>
  );
}
