import { useEffect, useState } from "react";
import { Layers, Clock, Hash, Loader2, Inbox, CheckCircle2, XCircle } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card } from "../../components/ui";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.listServices()
      .then(({ data }) => setServices(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des services</h1>
          <p className="text-slate-500 text-sm mt-1">Consultez la liste des services administratifs disponibles, leurs codes et leurs délais de traitement.</p>
        </div>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
          <p className="text-xs font-medium">Chargement des services...</p>
        </div>
      ) : services.length === 0 ? (
        <Card className="p-12 text-center rounded-2xl border border-slate-100 shadow-sm bg-white">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-700 font-semibold text-sm">Aucun service trouvé</p>
          <p className="text-slate-400 text-xs mt-1">Aucun service administratif n'est enregistré pour le moment.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {services.map((s) => (
            <Card key={s.id} className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                      {s.code && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                          <Hash size={13} />
                          <span>Code : {s.code}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badge de statut */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                    s.is_active 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" 
                      : "bg-slate-100 text-slate-600 border border-slate-200/60"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {s.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {s.description || "Aucune description fournie pour ce service."}
                </p>
              </div>

              {/* Délai de traitement */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock size={14} className="text-slate-400" />
                  Délai estimé :
                </span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {s.processing_delay_days} {s.processing_delay_days > 1 ? "jours" : "jour"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}