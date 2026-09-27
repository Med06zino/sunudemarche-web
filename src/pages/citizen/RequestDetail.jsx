import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, FileText, History, Send, Building, MapPin,
  RefreshCw, AlertCircle, CheckCircle2, Package, Printer,
  Loader2, Copy, Bell,
} from "lucide-react";
import toast from "react-hot-toast";
import * as api from "../../api/endpoints";
import { Card, Button, Textarea, Alert, PageLoader } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

const STATUS_LABELS = {
  BROUILLON: "Brouillon", SOUMISE: "Soumise", EN_VERIFICATION: "En vérification",
  EN_TRAITEMENT: "En traitement", VALIDEE: "Validée",
  DOCUMENT_DISPONIBLE: "Document disponible", RECUPEREE: "Récupérée",
  CORRECTION_DEMANDEE: "Correction demandée", REFUSEE: "Refusée", ANNULEE: "Annulée",
};

const FIELD_LABELS = {
  full_name: "Nom complet", date_of_birth: "Date de naissance",
  place_of_birth: "Lieu de naissance", father_full_name: "Nom du père",
  mother_full_name: "Nom de la mère", reason: "Motif de la demande",
};

const CHANNEL_LABELS = {
  INTERNAL: "Interne", EMAIL: "Email", SMS: "SMS", WHATSAPP: "WhatsApp",
};

export default function RequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [correctionData, setCorrectionData] = useState({});

  function load() {
    setLoading(true);
    api.getRequest(id)
      .then(({ data }) => {
        const r = data.data || data;
        setRequest(r);
        setCorrectionData(r.form_data || {});
      })
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function handleSubmitDraft() {
    setSubmitting(true); setError("");
    try {
      await api.submitRequest(id);
      load();
    } catch (err) {
      setError(
        err.response?.data?.errors?.detail ||
        err.response?.data?.detail ||
        "Impossible de soumettre la demande."
      );
    } finally { setSubmitting(false); }
  }

  async function handleResubmit() {
    setSubmitting(true); setError("");
    try {
      await api.updateRequest(id, { form_data: correctionData });
      await api.submitRequest(id);
      load();
    } catch (err) {
      setError(
        err.response?.data?.errors?.detail ||
        err.response?.data?.detail ||
        "Impossible de renvoyer la demande."
      );
    } finally { setSubmitting(false); }
  }

  /**
   * Ouvre le document officiel dans un nouvel onglet.
   * Utilise Axios (avec Bearer token) pour récupérer le fichier en blob,
   * puis crée une URL objet temporaire — évite d'exposer le token dans l'URL.
   */
  async function handlePrint() {
    if (!request?.official_document?.id) return;
    setPrinting(true);
    try {
      const { data: blob } = await api.downloadDocument(request.official_document.id);
      const blobUrl = URL.createObjectURL(blob);
      const win = window.open(blobUrl, "_blank");
      // Libère la mémoire après ouverture
      if (win) {
        win.addEventListener("load", () => URL.revokeObjectURL(blobUrl), { once: true });
      } else {
        // Popup bloqué : fallback téléchargement
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = request.official_document.filename || "document-officiel";
        a.click();
        URL.revokeObjectURL(blobUrl);
        toast("Document téléchargé.", { icon: "📄" });
      }
    } catch {
      toast.error("Impossible d'ouvrir le document. Veuillez réessayer.");
    } finally {
      setPrinting(false);
    }
  }

  if (loading) return <PageLoader message="Chargement du dossier..." />;

  if (!request) return (
    <div className="text-center py-16">
      <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
      <p className="font-bold text-slate-700 mb-4">Demande introuvable.</p>
      <Link to="/citoyen/demandes">
        <Button variant="outline" size="sm">Retour à mes demandes</Button>
      </Link>
    </div>
  );

  // Le bouton impression est visible UNIQUEMENT si :
  // 1. Le statut est DOCUMENT_DISPONIBLE ou RECUPEREE
  // 2. ET un document officiel a bien été uploadé par l'agent
  const canPrint =
    ["DOCUMENT_DISPONIBLE", "RECUPEREE"].includes(request.status) &&
    !!request.official_document?.id;

  return (
    <div className="max-w-4xl space-y-6 pb-10 animate-fade-in">

      {/* Fil d'ariane */}
      <Link to="/citoyen/demandes" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
        <ArrowLeft size={13} /> Retour à mes demandes
      </Link>

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-1.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{request.reference}</h1>
            <StatusBadge status={request.status} size="lg" />
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Building size={12} /> <strong className="text-slate-600">{request.service?.name}</strong>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} /> {request.center?.name}
            </span>
            {request.quantity > 1 && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Copy size={12} /> {request.quantity} copies
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bouton impression — visible uniquement si doc officiel disponible */}
        {canPrint && (
          <Button
            onClick={handlePrint}
            disabled={printing}
            variant="secondary"
            size="sm"
            className="shrink-0 gap-2"
            title={`Ouvrir : ${request.official_document.filename}`}
          >
            {printing
              ? <><Loader2 size={14} className="animate-spin" /> Ouverture...</>
              : <><Printer size={14} /> Imprimer le document officiel</>
            }
          </Button>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* ── Bandeaux contextuels ── */}

      {request.status === "BROUILLON" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <div>
            <p className="font-bold text-amber-900 text-sm">Demande en brouillon</p>
            <p className="text-xs text-amber-700 mt-0.5">Cette demande n'a pas encore été transmise.</p>
          </div>
          <Button
            onClick={handleSubmitDraft}
            disabled={submitting}
            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white"
            size="sm"
          >
            {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
            Soumettre la demande
          </Button>
        </div>
      )}

      {request.status === "CORRECTION_DEMANDEE" && (
        <div className="space-y-4">
          <Alert variant="warning">
            <span className="font-bold block mb-1">Note de correction :</span>
            {request.correction_note}
          </Alert>
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Corrigez votre formulaire</h3>
              <p className="text-xs text-slate-400 mt-0.5">Mettez à jour les informations et renvoyez votre dossier.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(correctionData).map((key) => (
                <div key={key} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {FIELD_LABELS[key] || key}
                  </label>
                  <Textarea
                    value={correctionData[key] || ""}
                    onChange={(e) => setCorrectionData({ ...correctionData, [key]: e.target.value })}
                    rows={2}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button onClick={handleResubmit} disabled={submitting} size="sm">
                {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                Renvoyer la demande corrigée
              </Button>
            </div>
          </Card>
        </div>
      )}

      {request.status === "REFUSEE" && (
        <Alert variant="error">
          <span className="font-bold block mb-1">Motif du refus :</span>
          {request.rejection_reason || "Votre demande n'a pas pu aboutir."}
        </Alert>
      )}

      {request.status === "DOCUMENT_DISPONIBLE" && (
        <div className="flex items-start gap-3 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <Package size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-emerald-900 text-sm">Document prêt !</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Rendez-vous au centre <strong>{request.center?.name}</strong> muni de votre pièce d'identité.
              {request.quantity > 1 && (
                <span className="block mt-0.5">
                  {request.quantity} copies physiques sont prêtes à être remises.
                </span>
              )}
            </p>
          </div>
          {canPrint && (
            <Button
              onClick={handlePrint}
              disabled={printing}
              variant="secondary"
              size="sm"
              className="shrink-0"
            >
              {printing
                ? <><Loader2 size={13} className="animate-spin" /> Ouverture...</>
                : <><Printer size={13} /> Ouvrir</>
              }
            </Button>
          )}
        </div>
      )}

      {/* Doc disponible mais pas encore uploadé par l'agent */}
      {request.status === "DOCUMENT_DISPONIBLE" && !request.official_document?.id && (
        <Alert variant="info">
          Le document officiel sera disponible dès que l'agent l'aura déposé sur la plateforme.
        </Alert>
      )}

      {request.status === "RECUPEREE" && (
        <Alert variant="success">
          <span className="font-bold">Dossier finalisé.</span> Ce document a été récupéré. La démarche est clôturée.
        </Alert>
      )}

      {/* ── Grille principale ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Informations renseignées */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <FileText size={16} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Informations renseignées</h3>
          </div>
          <div className="px-5 py-4 space-y-2">
            {Object.entries(request.form_data || {}).length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">Aucune information additionnelle.</p>
            ) : (
              Object.entries(request.form_data || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {FIELD_LABELS[key] || key}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 text-right max-w-[55%] truncate">
                    {value || "—"}
                  </span>
                </div>
              ))
            )}

            {/* Quantité et canal dans la même carte */}
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Copy size={11} /> Copies demandées
              </span>
              <span className="text-sm font-bold text-slate-900">
                {request.quantity ?? 1}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Bell size={11} /> Canal de notif.
              </span>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">
                  {CHANNEL_LABELS[request.notification_channel] || request.notification_channel}
                </span>
                {request.notification_contact && (
                  <p className="text-[11px] text-slate-400">{request.notification_contact}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Historique */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <History size={16} className="text-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Historique du dossier</h3>
          </div>
          <div className="px-5 py-4">
            {(!request.status_history || request.status_history.length === 0) ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">Aucun historique disponible.</p>
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
                        {STATUS_LABELS[h.new_status] || h.new_status}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(h.created_at).toLocaleString("fr-FR")}
                        {h.changed_by_name && ` · ${h.changed_by_name}`}
                      </p>
                      {h.comment && (
                        <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                          {h.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
