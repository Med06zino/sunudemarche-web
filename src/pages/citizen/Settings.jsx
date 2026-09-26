import { Bell, Shield, Smartphone, Mail, MessageSquare } from "lucide-react";
import { Card, Alert } from "../../components/ui";

export default function CitizenSettings() {
  return (
    <div className="max-w-3xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez vos préférences de compte et de notifications.</p>
      </div>

      {/* Carte des Préférences */}
      <Card className="p-8 rounded-2xl border border-slate-100 shadow-sm bg-white space-y-6">
        
        {/* Section Notifications */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Bell size={16} className="text-primary" />
            Préférences de notification
          </h3>
          
          <div className="flex items-center justify-between py-3 hover:bg-slate-50/80 -mx-4 px-4 rounded-xl transition-colors">
            <div className="space-y-0.5">
              <div className="font-semibold text-sm text-slate-900">Notifications internes</div>
              <div className="text-xs text-slate-500">Recevoir une notification sur la plateforme à chaque changement de statut.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Section Bientôt disponible */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Smartphone size={16} className="text-primary" />
            Canaux multicanaux (Prochainement)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col items-center text-center space-y-2">
              <Mail size={20} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-700">Email</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col items-center text-center space-y-2">
              <Smartphone size={20} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-700">SMS</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col items-center text-center space-y-2">
              <MessageSquare size={20} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-700">WhatsApp</span>
            </div>
          </div>

          <Alert variant="info" className="rounded-xl border border-blue-100 bg-blue-50/50 text-blue-900 shadow-sm mt-4">
            Les notifications par SMS, email et WhatsApp seront bientôt activées pour un suivi encore plus direct de vos démarches.
          </Alert>
        </div>

      </Card>
    </div>
  );
}