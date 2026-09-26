import { Settings, Sliders, Shield, Bell, CreditCard } from "lucide-react";
import { Card, Alert } from "../../components/ui";

export default function AdminSettings() {
  return (
    <div className="max-w-4xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Paramètres de la plateforme</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les configurations globales et les options avancées du système.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Alerte d'information */}
        <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
          <Alert variant="info" className="mb-6">
            La configuration avancée (canaux de notification, intégrations administrations, paiement en ligne) sera disponible dans une prochaine version.
          </Alert>

          {/* Aperçu des modules futurs */}
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Bell size={16} />
              </div>
              <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
              <p className="text-xs text-slate-500">Canaux SMS, e-mail et webhooks</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Shield size={16} />
              </div>
              <h3 className="font-semibold text-sm text-slate-800">Intégrations</h3>
              <p className="text-xs text-slate-500">Passerelles et services tiers</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <CreditCard size={16} />
              </div>
              <h3 className="font-semibold text-sm text-slate-800">Paiements</h3>
              <p className="text-xs text-slate-500">Solutions de paiement en ligne</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}