import { useEffect, useState } from "react";
import { Layers, Clock, Hash, Search } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, PageLoader, EmptyState, Badge } from "../../components/ui";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.listServices()
      .then(({ data }) => {
        const list = data.results || data.data || data;
        setServices(list);
        setFiltered(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(q ? services.filter((s) => `${s.name} ${s.code}`.toLowerCase().includes(q)) : services);
  }, [search, services]);

  return (
    <div className="max-w-5xl space-y-6 pb-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Services</h1>
          <p className="text-slate-500 text-sm mt-1">Services administratifs disponibles sur la plateforme.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 shadow-sm transition-all" />
        </div>
      </div>

      {loading ? (
        <PageLoader message="Chargement..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Layers} title="Aucun service trouvé" />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((s) => (
            <Card key={s.id} hover className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{s.name}</h3>
                    {s.code && (
                      <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Hash size={10} /> {s.code}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={s.is_active ? "success" : "default"}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {s.is_active ? "Actif" : "Inactif"}
                </Badge>
              </div>
              {s.description && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{s.description}</p>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock size={12} /> Délai estimé</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {s.processing_delay_days} jour{s.processing_delay_days > 1 ? "s" : ""}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
