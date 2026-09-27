import { useEffect, useState } from "react";
import { Building2, MapPin, Layers, Search, FolderOpen } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, PageLoader, EmptyState } from "../../components/ui";

export default function AdminCenters() {
  const [centers, setCenters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.listCenters()
      .then(({ data }) => {
        const list = data.results || data.data || data;
        setCenters(list);
        setFiltered(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(q ? centers.filter((c) => `${c.name} ${c.commune_name} ${c.address}`.toLowerCase().includes(q)) : centers);
  }, [search, centers]);

  return (
    <div className="max-w-5xl space-y-6 pb-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Centres</h1>
          <p className="text-slate-500 text-sm mt-1">Centres administratifs et leurs services.</p>
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
        <EmptyState icon={Building2} title="Aucun centre trouvé" />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((c) => (
            <Card key={c.id} hover className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                  <Building2 size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{c.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} />
                    {c.commune_name ? `${c.commune_name} — ` : ""}{c.address || "Adresse non précisée"}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  <Layers size={11} /> Services ({c.services?.length || 0})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(!c.services || c.services.length === 0) ? (
                    <span className="text-xs text-slate-400 italic">Aucun service</span>
                  ) : (
                    c.services.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-primary/[0.07] text-primary font-medium border border-primary/10">
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
