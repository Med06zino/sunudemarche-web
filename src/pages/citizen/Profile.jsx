import { useEffect, useState } from "react";
import {
  User, Phone, CreditCard, Loader2, Save, CheckCircle2,
  Mail, Bell, BellOff, MessageCircle,
} from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Input, Button, Alert, Badge } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

// ─── Configuration des canaux ──────────────────────────────────────────────
const CHANNEL_CONFIG = {
  INTERNAL: { Icon: BellOff,       label: "Interne seulement", desc: "Notifications dans l'espace SunuDémarche." },
  EMAIL:    { Icon: Mail,          label: "Email",              desc: "Alertes envoyées par email." },
  SMS:      { Icon: Phone,         label: "SMS",                desc: "Alertes par SMS." },
  WHATSAPP: { Icon: MessageCircle, label: "WhatsApp",           desc: "Alertes par WhatsApp." },
};

// ─── Section card ──────────────────────────────────────────────────────────
function Section({ icon: Icon, title, children }) {
  return (
    <div className="pt-6 first:pt-0">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-primary/8 text-primary flex items-center justify-center">
          <Icon size={14} />
        </div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function CitizenProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "", last_name: "", phone_number: "",
    citizen_profile: {
      date_of_birth: "", place_of_birth: "",
      national_id_number: "", address: "",
      default_notification_channel: "INTERNAL",
    },
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        citizen_profile: {
          date_of_birth: user.citizen_profile?.date_of_birth || "",
          place_of_birth: user.citizen_profile?.place_of_birth || "",
          national_id_number: user.citizen_profile?.national_id_number || "",
          address: user.citizen_profile?.address || "",
          default_notification_channel:
            user.citizen_profile?.default_notification_channel || "INTERNAL",
        },
      });
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setSaved(false); setError("");
    try {
      const { data } = await api.updateProfile(form);
      setUser(data.data || data);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      setError("Erreur lors de la mise à jour. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  }

  const cp = form.citizen_profile;
  const setcp = (field) => (e) =>
    setForm({ ...form, citizen_profile: { ...cp, [field]: e.target.value } });
  const setChannel = (value) =>
    setForm({ ...form, citizen_profile: { ...cp, default_notification_channel: value } });

  return (
    <div className="max-w-3xl space-y-6 pb-10 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mon profil</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      {saved && (
        <Alert variant="success">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} /> Profil mis à jour avec succès.
          </div>
        </Alert>
      )}
      {error && <Alert variant="error">{error}</Alert>}

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 divide-y divide-slate-100">

          {/* Identité */}
          <Section icon={User} title="Identité">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Prénom" value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              <Input label="Nom" value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </div>
          </Section>

          {/* Coordonnées */}
          <Section icon={Mail} title="Coordonnées">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email (non modifiable)"
                value={user?.email || ""}
                disabled
                className="bg-slate-50 text-slate-400 cursor-not-allowed"
                hint="L'adresse email ne peut pas être modifiée."
              />
              <Input
                label="Téléphone"
                type="tel"
                placeholder="+221 77 000 00 00"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              />
            </div>
          </Section>

          {/* État civil & Adresse */}
          <Section icon={CreditCard} title="État civil & Adresse">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Date de naissance" type="date"
                value={cp.date_of_birth} onChange={setcp("date_of_birth")} />
              <Input label="Lieu de naissance" placeholder="Ex : Dakar"
                value={cp.place_of_birth} onChange={setcp("place_of_birth")} />
              <Input label="N° pièce d'identité" placeholder="CNI / Passeport"
                value={cp.national_id_number} onChange={setcp("national_id_number")} />
              <Input label="Adresse de résidence" placeholder="Ex : Liberté 6, Dakar"
                value={cp.address} onChange={setcp("address")} />
            </div>
          </Section>

          {/* Canal de notification par défaut */}
          <Section icon={Bell} title="Préférences de notification">
            <p className="text-xs text-slate-500 mb-4">
              Canal utilisé par défaut pour les nouvelles demandes. Vous pouvez le modifier
              individuellement à chaque nouvelle demande.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(CHANNEL_CONFIG).map(([value, cfg]) => {
                const Icon = cfg.Icon;
                const selected = cp.default_notification_channel === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setChannel(value)}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 text-xs font-semibold
                      transition-all duration-150 cursor-pointer text-center
                      ${selected
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"}`}
                    title={cfg.desc}
                  >
                    <Icon size={20} className={selected ? "text-primary" : "text-slate-400"} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
            {cp.default_notification_channel !== "INTERNAL" && (
              <div className="mt-3">
                <Alert variant="info">
                  Canal <strong>{CHANNEL_CONFIG[cp.default_notification_channel]?.label}</strong> sélectionné.
                  Vous pourrez renseigner le contact associé lors de chaque nouvelle demande.
                </Alert>
              </div>
            )}
          </Section>

          {/* Bouton sauvegarde */}
          <div className="flex justify-end pt-5">
            <Button type="submit" disabled={saving}>
              {saving
                ? <><Loader2 size={15} className="animate-spin" /> Enregistrement...</>
                : <><Save size={15} /> Enregistrer les modifications</>
              }
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
