import { useEffect, useState } from "react";
import { User, Phone, MapPin, CreditCard, Calendar, CheckCircle2, Loader2, Save } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Input, Button, Alert } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function CitizenProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "", last_name: "", phone_number: "",
    citizen_profile: { date_of_birth: "", place_of_birth: "", national_id_number: "", address: "" },
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

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
        },
      });
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { data } = await api.updateProfile(form);
      setUser(data.data || data);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000); // Disparaît après 4s
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil :", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mon profil</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez vos informations personnelles et administratives en toute sécurité.</p>
      </div>

      {saved && (
        <div className="animate-fadeIn">
          <Alert variant="success" className="rounded-xl border border-emerald-100 shadow-sm">
            Profil mis à jour avec succès.
          </Alert>
        </div>
      )}

      {/* Carte principale */}
      <Card className="p-8 rounded-2xl border border-slate-100 shadow-sm bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section Identité */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={16} className="text-primary" />
              Informations d'identité
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input 
                label="Prénom" 
                value={form.first_name} 
                onChange={(e) => setForm({ ...form, first_name: e.target.value })} 
              />
              <Input 
                label="Nom" 
                value={form.last_name} 
                onChange={(e) => setForm({ ...form, last_name: e.target.value })} 
              />
            </div>
          </div>

          {/* Section Contact & Compte */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Phone size={16} className="text-primary" />
              Coordonnées
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input 
                label="Email (non modifiable)" 
                value={user?.email || ""} 
                disabled 
                className="bg-slate-50 text-slate-500 cursor-not-allowed" 
              />
              <Input 
                label="Téléphone" 
                value={form.phone_number} 
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })} 
              />
            </div>
          </div>

          {/* Section Informations complémentaires */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-primary" />
              Informations d'état civil & Adresse
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Date de naissance" 
                type="date"
                value={form.citizen_profile.date_of_birth}
                onChange={(e) => setForm({ ...form, citizen_profile: { ...form.citizen_profile, date_of_birth: e.target.value } })}
              />
              <Input
                label="Lieu de naissance"
                value={form.citizen_profile.place_of_birth}
                placeholder="Ex: Dakar"
                onChange={(e) => setForm({ ...form, citizen_profile: { ...form.citizen_profile, place_of_birth: e.target.value } })}
              />
              <Input
                label="N° pièce d'identité (CNI / Passeport)"
                value={form.citizen_profile.national_id_number}
                placeholder="Numéro d'identification"
                onChange={(e) => setForm({ ...form, citizen_profile: { ...form.citizen_profile, national_id_number: e.target.value } })}
              />
              <Input
                label="Adresse de résidence"
                value={form.citizen_profile.address}
                placeholder="Ex: Liberté 6, Dakar"
                onChange={(e) => setForm({ ...form, citizen_profile: { ...form.citizen_profile, address: e.target.value } })}
              />
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
            <Button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Mettre à jour le profil</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}