import { useEffect, useState } from "react";
import { Building2, MapPin, Layers, Loader2, Inbox } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card } from "../../components/ui";

export default function AdminCenters() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.listCenters()
      .then(({ data }) => setCenters(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des centres</h1>
          <p className="text-slate-500 text-sm mt-1">Consultez la liste des centres administratifs, leurs localisations et les services associés.</p>
        </div>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
          <p className="text-xs font-medium">Chargement des centres...</p>
        </div>
      ) : centers.length === 0 ? (
        <Card className="p-12 text-center rounded-2xl border border-slate-100 shadow-sm bg-white">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-700 font-semibold text-sm">Aucun centre trouvé</p>
          <p className="text-slate-400 text-xs mt-1">Aucun centre administratif n'est enregistré pour le moment.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {centers.map((c) => (
            <Card key={c.id} className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span>{c.commune_name ? `${c.commune_name} — ` : ""}{c.address || "Adresse non précisée"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services rattachés */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Layers size={13} className="text-slate-400" />
                  <span>Services disponibles ({c.services?.length || 0})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(!c.services || c.services.length === 0) ? (
                    <span className="text-xs text-slate-400 italic">Aucun service associé.</span>
                  ) : (
                    c.services.map((s) => (
                      <span 
                        key={s} 
                        className="text-xs px-2.5 py-1 rounded-lg bg-primary/[0.06] text-primary font-medium border border-primary/10"
                      >
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}