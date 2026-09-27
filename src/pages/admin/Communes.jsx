import { useEffect, useState } from "react";
import { MapPin, Globe, Hash, Search } from "lucide-react";
import * as api from "../../api/endpoints";
import { Card, PageLoader, EmptyState } from "../../components/ui";

export default function AdminCommunes() {
  const [communes, setCommunes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.listCommunes()
      .then(({ data }) => {
        const list = data.results || data.data || data;
        setCommunes(list);
        setFiltered(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(q ? communes.filter((c) => `${c.name} ${c.region} ${c.code}`.toLowerCase().includes(q)) : communes);
  }, [search, communes]);

  return (
    <div className="max-w-5xl space-y-6 pb-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Communes</h1>
          <p className="text-slate-500 text-sm mt-1">Communes enregistrées et leurs codes administratifs.</p>
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
        <EmptyState icon={MapPin} title="Aucune commune trouvée" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} hover className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{c.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Globe size={11} /> {c.region || "Région non précisée"}
                  </p>
                </div>
              </div>
              {c.code && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1"><Hash size={11} /> Code</span>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{c.code}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
