import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/endpoints";
import { Card, Button } from "../../components/ui";
import { FileText, Clock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listServices()
      .then(({ data }) => setServices(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      
      {/* En-tête de la page */}
      <div className="max-w-2xl mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold mb-3">
          Catalogue officiel
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">
          Services administratifs disponibles
        </h1>
        <p className="text-text-secondary text-sm md:text-base">
          Consultez l'ensemble des démarches en ligne proposées sur SunuDémarche et initiez votre demande en quelques clics.
        </p>
      </div>

      {/* Contenu dynamique selon l'état */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-text-secondary text-sm font-medium">Chargement des services en cours...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-text text-base">Aucun service disponible</h3>
          <p className="text-text-secondary text-sm">
            Il n'y a actuellement aucun service actif sur la plateforme. Veuillez réitérer ultérieurement.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <Card key={s.id} className="flex flex-col justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
              <div>
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  {s.processing_delay_days && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {s.processing_delay_days} jours ouvrés
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-lg text-text mb-2">
                  {s.name}
                </h3>
                
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  {s.description || "Démarche administrative en ligne, sécurisée et transmise directement au centre compétent pour traitement."}
                </p>
              </div>

              {/* Pied de carte avec action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Service en ligne
                </span>
                
                <Link to={`/inscription`}>
                  <Button variant="ghost" className="text-primary hover:text-primary-dark font-medium text-xs md:text-sm flex items-center gap-1.5 p-0 hover:bg-transparent">
                    Faire une demande
                    <ArrowRight className="w-4 h-4" />
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