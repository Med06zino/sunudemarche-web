import { useEffect, useState } from "react";
import { MapPin, Globe, Hash, Loader2, Inbox } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card } from "../../components/ui";

export default function AdminCommunes() {
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.listCommunes()
      .then(({ data }) => setCommunes(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl space-y-8 pb-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des communes</h1>
          <p className="text-slate-500 text-sm mt-1">Consultez la liste des communes enregistrées, leurs régions et leurs codes administratifs.</p>
        </div>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
          <p className="text-xs font-medium">Chargement des communes...</p>
        </div>
      ) : communes.length === 0 ? (
        <Card className="p-12 text-center rounded-2xl border border-slate-100 shadow-sm bg-white">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-700 font-semibold text-sm">Aucune commune trouvée</p>
          <p className="text-slate-400 text-xs mt-1">Aucune commune n'est enregistrée pour le moment.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {communes.map((c) => (
            <Card key={c.id} className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-base truncate">{c.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <Globe size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{c.region || "Région non précisée"}</span>
                  </div>
                </div>
              </div>

              {c.code && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Hash size={13} /> Code administratif
                  </span>
                  <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {c.code}
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}