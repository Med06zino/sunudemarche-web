import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2, CheckCircle2, ArrowRight, ArrowLeft, Send,
  FileText, MapPin, AlertCircle, Minus, Plus as PlusIcon,
  Bell, Phone, Mail, MessageCircle, BellOff,
} from "lucide-react";
import toast from "react-hot-toast";
import * as api from "../../api/endpoints";
import { Card, Button, Input, Alert } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

const STEPS = [
  { label: "Service",    desc: "Choisissez le type de démarche" },
  { label: "Centre",     desc: "Sélectionnez un centre de dépôt" },
  { label: "Formulaire", desc: "Renseignez les informations requises" },
  { label: "Résumé",    desc: "Vérifiez et soumettez votre dossier" },
];

const FIELD_LABELS = {
  full_name: "Nom complet", date_of_birth: "Date de naissance",
  place_of_birth: "Lieu de naissance", father_full_name: "Nom du père",
  mother_full_name: "Nom de la mère", reason: "Motif de la demande",
};

// Canaux disponibles avec icône et placeholder de contact
const CHANNEL_CONFIG = {
  INTERNAL:  { Icon: BellOff,        label: "Interne seulement",  needsContact: false, placeholder: "" },
  EMAIL:     { Icon: Mail,           label: "Email",               needsContact: true,  placeholder: "vous@exemple.sn" },
  SMS:       { Icon: Phone,          label: "SMS",                 needsContact: true,  placeholder: "+221 77 000 00 00" },
  WHATSAPP:  { Icon: MessageCircle,  label: "WhatsApp",            needsContact: true,  placeholder: "+221 77 000 00 00" },
};

export default function NewRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [formData, setFormData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [notifChannel, setNotifChannel] = useState(
    user?.citizen_profile?.default_notification_channel || "INTERNAL"
  );
  const [notifContact, setNotifContact] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingCenters, setLoadingCenters] = useState(false);

  // Charger les services
  useEffect(() => {
    api.listServices()
      .then(({ data }) => {
        const r = data.results || data.data || data;
        setServices(Array.isArray(r) ? r : []);
      })
      .catch(() => setError("Impossible de charger les services."))
      .finally(() => setLoadingServices(false));
  }, []);

  // Charger les centres filtrés par service
  useEffect(() => {
    if (!selectedService) return;
    setLoadingCenters(true);
    setSelectedCenter(null);
    api.listCenters({ service: selectedService.code || selectedService.id })
      .then(({ data }) => {
        const r = data.results || data.data || data;
        setCenters(Array.isArray(r) ? r : []);
      })
      .catch(() => setCenters([]))
      .finally(() => setLoadingCenters(false));
  }, [selectedService]);

  const schemaFields = selectedService?.required_fields_schema?.fields || [];
  const channelCfg = CHANNEL_CONFIG[notifChannel] ?? CHANNEL_CONFIG.INTERNAL;

  // Validation de l'étape formulaire avant de passer au résumé
  function canProceedFromForm() {
    if (quantity < 1 || quantity > 20) return false;
    if (channelCfg.needsContact && !notifContact.trim()) return false;
    return true;
  }

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      const payload = {
        service: selectedService.id,
        center: selectedCenter.id,
        form_data: formData,
        quantity,
        notification_channel: notifChannel,
        ...(channelCfg.needsContact && notifContact.trim()
          ? { notification_contact: notifContact.trim() }
          : {}),
      };
      const { data: created } = await api.createRequest(payload);
      const reqId = created.id || created.data?.id;
      await api.submitRequest(reqId);
      toast.success("Demande soumise avec succès !");
      navigate(`/citoyen/demandes/${reqId}`);
    } catch (err) {
      const errs = err.response?.data?.errors;
      const msg = (typeof errs === "object" && errs !== null)
        ? Object.values(errs).flat().join(" ")
        : err.response?.data?.detail || "Une erreur est survenue.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6 pb-10 animate-fade-in">

      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nouvelle demande</h1>
        <p className="text-slate-500 text-sm mt-1">Suivez les étapes pour constituer et soumettre votre dossier.</p>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200
                    ${done   ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                    : active ? "bg-primary text-white shadow-sm shadow-primary/25 ring-4 ring-primary/10"
                    :          "bg-slate-100 text-slate-400"}`}
                  >
                    {done ? <CheckCircle2 size={17} /> : i + 1}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${active ? "text-primary" : "text-slate-400"}`}>
                      Étape {i + 1}
                    </p>
                    <p className={`text-xs font-semibold ${active ? "text-slate-900" : "text-slate-400"}`}>
                      {s.label}
                    </p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded-full hidden sm:block
                    ${i < step ? "bg-emerald-300" : "bg-slate-100"}`} />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3 sm:hidden text-center font-medium">
          {STEPS[step].desc}
        </p>
      </div>

      {error && (
        <Alert variant="error">
          <div className="flex items-center gap-2"><AlertCircle size={14} /> {error}</div>
        </Alert>
      )}

      {/* Contenu de l'étape */}
      <Card className="p-6 sm:p-8">

        {/* ─ ÉTAPE 0 : SERVICE ─ */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Choisissez un service</h2>
              <p className="text-slate-400 text-xs mt-0.5">Sélectionnez le type de démarche que vous souhaitez effectuer.</p>
            </div>
            {loadingServices ? (
              <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                <Loader2 size={24} className="animate-spin text-primary" />
                <p className="text-xs">Chargement des services...</p>
              </div>
            ) : services.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8">Aucun service disponible pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {services.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150
                      ${selectedService?.id === s.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/60"}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${selectedService?.id === s.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                      <FileText size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center
                      ${selectedService?.id === s.id ? "border-primary bg-primary" : "border-slate-300"}`}>
                      {selectedService?.id === s.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─ ÉTAPE 1 : CENTRE ─ */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Choisissez un centre de dépôt</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Centres proposant <strong className="text-slate-600">{selectedService?.name}</strong>
              </p>
            </div>
            {loadingCenters ? (
              <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                <Loader2 size={24} className="animate-spin text-primary" />
                <p className="text-xs">Recherche des centres...</p>
              </div>
            ) : centers.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-semibold text-sm">Aucun centre disponible pour ce service.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {centers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCenter(c)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150
                      ${selectedCenter?.id === c.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/60"}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${selectedCenter?.id === c.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {c.commune_name || c.commune}{c.address ? ` — ${c.address}` : ""}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center
                      ${selectedCenter?.id === c.id ? "border-primary bg-primary" : "border-slate-300"}`}>
                      {selectedCenter?.id === c.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─ ÉTAPE 2 : FORMULAIRE + QUANTITÉ + CANAL ─ */}
        {step === 2 && (
          <div className="space-y-7">

            {/* Champs du formulaire dynamique */}
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Informations requises</h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Service : <strong className="text-slate-700">{selectedService?.name}</strong>
                </p>
              </div>
              {schemaFields.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 font-medium">Aucun champ supplémentaire requis.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {schemaFields.map((f) => (
                    <Input
                      key={f.name}
                      label={`${FIELD_LABELS[f.name] || f.label}${f.required ? " *" : ""}`}
                      type={f.type === "date" ? "date" : "text"}
                      required={f.required}
                      placeholder={f.placeholder || ""}
                      value={formData[f.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Quantité ── */}
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  Nombre de copies physiques
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Indiquez le nombre d'exemplaires originaux à préparer (max. 20).
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center
                    text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Diminuer"
                >
                  <Minus size={16} />
                </button>
                <div className="w-16 text-center">
                  <span className="text-2xl font-extrabold text-slate-900 tabular-nums">{quantity}</span>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {quantity > 1 ? "copies" : "copie"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  disabled={quantity >= 20}
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center
                    text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Augmenter"
                >
                  <PlusIcon size={16} />
                </button>
                {/* Saisie directe */}
                <input
                  type="number"
                  min={1} max={20}
                  value={quantity}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                    setQuantity(v);
                  }}
                  className="w-16 px-2 py-1.5 text-center text-sm border border-slate-200 rounded-xl
                    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                  aria-label="Quantité"
                />
              </div>
              {(quantity < 1 || quantity > 20) && (
                <p className="text-xs text-red-500 font-medium">La quantité doit être entre 1 et 20.</p>
              )}
            </div>

            {/* ── Canal de notification ── */}
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Bell size={14} className="text-primary" />
                  Canal de notification
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Comment souhaitez-vous être informé des mises à jour de cette demande ?
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(CHANNEL_CONFIG).map(([value, cfg]) => {
                  const Icon = cfg.Icon;
                  const selected = notifChannel === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setNotifChannel(value);
                        if (!cfg.needsContact) setNotifContact("");
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-semibold
                        transition-all duration-150 cursor-pointer
                        ${selected
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"}`}
                    >
                      <Icon size={20} className={selected ? "text-primary" : "text-slate-400"} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Champ contact conditionnel */}
              {channelCfg.needsContact && (
                <div className="animate-slide-up">
                  <Input
                    label={`Contact (${channelCfg.label}) *`}
                    type={notifChannel === "EMAIL" ? "email" : "tel"}
                    placeholder={channelCfg.placeholder}
                    value={notifContact}
                    onChange={(e) => setNotifContact(e.target.value)}
                    required
                    error={
                      channelCfg.needsContact && !notifContact.trim()
                        ? `Veuillez saisir un contact pour le canal ${channelCfg.label}.`
                        : undefined
                    }
                  />
                </div>
              )}

              {notifChannel === "INTERNAL" && (
                <p className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  Vous recevrez les notifications dans votre espace SunuDémarche uniquement.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─ ÉTAPE 3 : RÉSUMÉ ─ */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Résumé de votre demande</h2>
              <p className="text-slate-400 text-xs mt-0.5">Vérifiez les informations avant de soumettre définitivement.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100">
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Service</span>
                <span className="text-sm font-bold text-slate-900">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between items-start px-5 py-3.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Centre</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{selectedCenter?.name}</p>
                  {selectedCenter?.address && (
                    <p className="text-xs text-slate-400">{selectedCenter.address}</p>
                  )}
                </div>
              </div>
              {schemaFields.map((f) => (
                <div key={f.name} className="flex justify-between items-center px-5 py-3.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {FIELD_LABELS[f.name] || f.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 text-right max-w-[55%] truncate">
                    {formData[f.name] || <span className="text-slate-400 font-normal italic">—</span>}
                  </span>
                </div>
              ))}
              {/* Quantité */}
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Copies demandées</span>
                <span className="text-sm font-bold text-slate-900">
                  {quantity} copie{quantity > 1 ? "s" : ""}
                </span>
              </div>
              {/* Canal */}
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Canal de notification</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">
                    {CHANNEL_CONFIG[notifChannel]?.label}
                  </span>
                  {notifContact && (
                    <p className="text-xs text-slate-400">{notifContact}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-5 border-t border-slate-100">
          <Button
            variant="outline" size="sm"
            disabled={step === 0}
            onClick={() => { setError(""); setStep((s) => s - 1); }}
          >
            <ArrowLeft size={15} /> Précédent
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              size="sm"
              disabled={
                (step === 0 && !selectedService) ||
                (step === 1 && !selectedCenter) ||
                (step === 2 && !canProceedFromForm())
              }
              onClick={() => { setError(""); setStep((s) => s + 1); }}
            >
              Suivant <ArrowRight size={15} />
            </Button>
          ) : (
            <Button size="sm" onClick={handleSubmit} disabled={loading}>
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Soumission...</>
                : <><Send size={15} /> Soumettre la demande</>
              }
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
