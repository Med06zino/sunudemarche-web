import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, FileText, History, CheckCircle, XCircle,
  AlertTriangle, Play, ShieldCheck, Send, Loader2, AlertCircle,
  Upload, CheckCircle2, Copy, Bell, Eye, FileDown, Sparkles,
  RefreshCw, X,
} from "lucide-react";
import toast from "react-hot-toast";
import * as api from "../../api/endpoints";
import { Card, Button, Textarea, Alert, PageLoader, Badge } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

// ── Constantes ─────────────────────────────────────────────────────────────

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

// Les statuts où l'on peut générer / uploader un document officiel
const CAN_GENERATE_STATUSES = ["EN_TRAITEMENT", "VALIDEE", "DOCUMENT_DISPONIBLE"];

// ── Composant modal prévisualisation ────────────────────────────────────────

function PreviewModal({ blobUrl, onClose, onConfirmGenerate, generating }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Eye size={17} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Aperçu de l'extrait de naissance</h2>
              <p className="text-xs text-slate-400 mt-0.5">Vérifiez les informations avant de générer le document officiel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        {/* PDF embed */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={blobUrl}
            title="Aperçu extrait de naissance"
            className="w-full h-full min-h-[60vh]"
            style={{ border: "none" }}
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0 rounded-b-2xl">
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Ce document sera généré et envoyé automatiquement au citoyen.
            La demande passera en <strong>Document disponible</strong>.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={generating}
              onClick={onConfirmGenerate}
              className="gap-2"
            >
              {generating
                ? <><Loader2 size={14} className="animate-spin" /> Génération...</>
                : <><CheckCircle2 size={14} /> Générer et rendre disponible</>
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Composant principal ─────────────────────────────────────────────────────

export default function AgentRequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const fileInputRef = useRef(null);

  function load() {
    api.getAgentRequest(id)
      .then(({ data }) => setRequest(data.data || data))
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  // Nettoyer le blob URL quand le modal se ferme
  function closePreview() {
    if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    setPreviewBlobUrl(null);
  }

  // ── Actions de statut ────────────────────────────────────────────────
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

  // ── Upload manuel document officiel ──────────────────────────────────
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
      toast.error(
        err.response?.data?.errors?.detail ||
        err.response?.data?.detail ||
        "Échec de l'envoi du document."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // ── Prévisualisation PDF avant génération ────────────────────────────
  async function handlePreview() {
    setPreviewing(true);
    try {
      const { data: blob } = await api.previewExtract(id);
      const url = URL.createObjectURL(blob);
      setPreviewBlobUrl(url);
    } catch (err) {
      const msg =
        err.response?.data?.errors?.detail ||
        err.response?.data?.detail ||
        "Impossible de générer l'aperçu.";
      toast.error(msg);
    } finally {
      setPreviewing(false);
    }
  }

  // ── Génération définitive du PDF ─────────────────────────────────────
  async function handleGenerate() {
    setGenerating(true);
    try {
      const { data } = await api.generateExtract(id);
      closePreview();
      toast.success("Extrait généré et marqué comme disponible !");
      load();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.detail ||
        err.response?.data?.detail ||
        "Erreur lors de la génération de l'extrait.";
      toast.error(msg);
      closePreview();
    } finally {
      setGenerating(false);
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
  const isExtractNaissance = request.service?.code === "EXTRAIT_NAISSANCE";
  const canGenerate = isExtractNaissance && CAN_GENERATE_STATUSES.includes(request.status);

  return (
    <>
      {/* Modal prévisualisation */}
      {previewBlobUrl && (
        <PreviewModal
          blobUrl={previewBlobUrl}
          onClose={closePreview}
          onConfirmGenerate={handleGenerate}
          generating={generating}
        />
      )}

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

          {/* Données formulaire */}
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

          {/* Historique */}
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

        {/* ── Section génération automatique extrait de naissance ── */}
        {canGenerate && (
          <Card className="p-0 overflow-hidden border-primary/20">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-primary/10 bg-primary/[0.02]">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm">Générer l'extrait de naissance</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Génération automatique à partir des données de la demande — format officiel République du Sénégal
                </p>
              </div>
              {request.official_document?.id && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 size={12} /> Document généré
                </span>
              )}
            </div>

            <div className="p-5 space-y-4">
              {/* Document déjà généré */}
              {request.official_document?.id && (
                <div className="flex items-center justify-between gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileDown size={16} className="text-emerald-600 shrink-0" />
                    <span className="text-sm font-semibold text-emerald-800 truncate">
                      {request.official_document.filename || "extrait_naissance.pdf"}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePreview}
                    disabled={previewing}
                    className="shrink-0 text-xs gap-1.5"
                  >
                    {previewing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                    Regénérer
                  </Button>
                </div>
              )}

              {/* Vérification des données disponibles */}
              {(() => {
                const fd = request.form_data || {};
                const required = ["full_name", "date_of_birth", "place_of_birth", "father_full_name", "mother_full_name"];
                const missing = required.filter(f => !fd[f]);
                if (missing.length > 0) {
                  return (
                    <Alert variant="warning">
                      <strong className="block mb-1">Données manquantes</strong>
                      Les champs suivants sont requis pour générer l'extrait :{" "}
                      <strong>{missing.map(f => FIELD_LABELS[f] || f).join(", ")}</strong>.
                      Demandez une correction au citoyen.
                    </Alert>
                  );
                }
                return null;
              })()}

              {/* Récapitulatif des données qui seront utilisées */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-100/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Données qui seront inscrites sur le document
                  </p>
                </div>
                <div className="divide-y divide-slate-100">
                  {Object.entries(request.form_data || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center px-4 py-2.5">
                      <span className="text-xs text-slate-500">{FIELD_LABELS[key] || key}</span>
                      <span className="text-xs font-bold text-slate-900 text-right max-w-[55%]">
                        {val || <span className="text-red-400 font-normal italic">vide</span>}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-xs text-slate-500">Centre d'état civil</span>
                    <span className="text-xs font-bold text-slate-900">{request.center?.name || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-xs text-slate-500">Nombre d'exemplaires</span>
                    <span className="text-xs font-bold text-slate-900">
                      {request.quantity ?? 1} copie{(request.quantity ?? 1) > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePreview}
                  disabled={previewing}
                  className="gap-2"
                >
                  {previewing
                    ? <><Loader2 size={14} className="animate-spin" /> Chargement...</>
                    : <><Eye size={14} /> Prévisualiser l'extrait</>
                  }
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    // Générer directement sans prévisualisation
                    setGenerating(true);
                    try {
                      await api.generateExtract(id);
                      toast.success("Extrait généré et disponible pour le citoyen !");
                      load();
                    } catch (err) {
                      toast.error(
                        err.response?.data?.errors?.detail ||
                        err.response?.data?.detail ||
                        "Erreur lors de la génération."
                      );
                    } finally { setGenerating(false); }
                  }}
                  disabled={generating || previewing}
                  className="gap-2"
                >
                  {generating
                    ? <><Loader2 size={14} className="animate-spin" /> Génération...</>
                    : <><Sparkles size={14} /> Générer et rendre disponible</>
                  }
                </Button>
              </div>

              <p className="text-xs text-slate-400 flex items-start gap-1.5 pt-1">
                <span className="text-amber-400 shrink-0 mt-0.5">⚠</span>
                La génération crée le PDF officiel, le joint à la demande et notifie automatiquement
                le citoyen par {request.notification_channel === "EMAIL" ? "e-mail" : "notification interne"}.
              </p>
            </div>
          </Card>
        )}

        {/* ── Section upload manuel document officiel ── */}
        {["VALIDEE", "DOCUMENT_DISPONIBLE"].includes(request.status) && (
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
              <Upload size={16} className="text-slate-500" />
              <h3 className="font-bold text-slate-900 text-sm">
                Upload manuel d'un document officiel
              </h3>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-auto">
                Alternatif
              </span>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-500">
                Si vous disposez d'un document officiel signé et tamponné (scan PDF/image),
                vous pouvez l'uploader manuellement ici.
              </p>
              {request.official_document?.id && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <FileText size={14} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600 truncate flex-1">
                    {request.official_document.filename}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Déposé
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-xs gap-1.5"
                >
                  {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  {request.official_document?.id ? "Remplacer le fichier" : "Choisir un fichier"}
                </Button>
                <span className="text-[11px] text-slate-400">PDF, JPG, PNG</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="sr-only"
                onChange={handleOfficialDocUpload}
                aria-label="Sélectionner le document officiel"
              />
            </div>
          </Card>
        )}

        {/* ── Infos demande ── */}
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

        {/* ── Panel d'actions de statut ── */}
        {actions.length > 0 && (
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
              <ShieldCheck size={16} className="text-primary" />
              <h3 className="font-bold text-slate-900 text-sm">Actions disponibles</h3>
            </div>

            <div className="p-5 space-y-4">
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
            {request.rejection_reason && (
              <span className="block mt-1 font-semibold">
                Motif : {request.rejection_reason}
              </span>
            )}
          </Alert>
        )}
      </div>
    </>
  );
}
