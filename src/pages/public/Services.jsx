import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, Button } from "../../components/ui";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.listServices()
      .then(({ data }) => setServices(data.results || data.data || data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* En-tête */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-4 border border-primary/15">
          Catalogue officiel
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Services administratifs disponibles
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Consultez l'ensemble des démarches disponibles sur SunuDémarche et initiez votre demande en quelques minutes.
        </p>
      </div>

      {/* États */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Chargement des services...</p>
        </div>
      ) : error ? (
        <div className="max-w-sm mx-auto text-center py-16 space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">Impossible de charger les services.</p>
          <p className="text-slate-400 text-xs">Vérifiez votre connexion et réessayez.</p>
        </div>
      ) : services.length === 0 ? (
        <div className="max-w-sm mx-auto text-center py-16 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">Aucun service disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <Card
              key={s.id}
              hover
              className="flex flex-col justify-between p-6 border-slate-100"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                    <FileText size={22} />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {s.processing_delay_days && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        <Clock size={12} className="text-slate-400" />
                        {s.processing_delay_days} jour{s.processing_delay_days > 1 ? "s" : ""} ouvrés
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${s.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {s.is_active ? "Disponible" : "Indisponible"}
                    </span>
                  </div>
                </div>

                <h2 className="font-bold text-slate-900 text-lg mb-2">{s.name}</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {s.description || "Démarche administrative en ligne, sécurisée et transmise directement au centre compétent."}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {s.is_active ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <CheckCircle2 size={13} /> En ligne
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Bientôt disponible</span>
                )}
                <Link to="/inscription">
                  <Button variant="ghost" size="sm" className="text-primary font-semibold gap-1">
                    Faire une demande <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
