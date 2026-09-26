const STATUS_CONFIG = {
  BROUILLON:            { dot: "bg-slate-400",    cls: "bg-slate-50 text-slate-600 border-slate-200",     label: "Brouillon" },
  SOUMISE:              { dot: "bg-blue-400",      cls: "bg-blue-50 text-blue-700 border-blue-200",        label: "Soumise" },
  EN_VERIFICATION:      { dot: "bg-amber-400",     cls: "bg-amber-50 text-amber-700 border-amber-200",     label: "En vérification" },
  EN_TRAITEMENT:        { dot: "bg-orange-400",    cls: "bg-orange-50 text-orange-700 border-orange-200",  label: "En traitement" },
  VALIDEE:              { dot: "bg-emerald-500",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Validée" },
  DOCUMENT_DISPONIBLE:  { dot: "bg-teal-500",      cls: "bg-teal-50 text-teal-700 border-teal-200",        label: "Document disponible" },
  RECUPEREE:            { dot: "bg-slate-500",     cls: "bg-slate-100 text-slate-600 border-slate-200",    label: "Récupérée" },
  CORRECTION_DEMANDEE:  { dot: "bg-amber-500",     cls: "bg-amber-50 text-amber-800 border-amber-200",     label: "Correction demandée" },
  REFUSEE:              { dot: "bg-red-500",       cls: "bg-red-50 text-red-700 border-red-200",           label: "Refusée" },
  ANNULEE:              { dot: "bg-slate-300",     cls: "bg-slate-50 text-slate-400 border-slate-100",     label: "Annulée" },
};

export default function StatusBadge({ status, size = "sm" }) {
  const config = STATUS_CONFIG[status] ?? {
    dot: "bg-slate-400",
    cls: "bg-slate-50 text-slate-600 border-slate-200",
    label: status,
  };

  const textSize = size === "lg" ? "text-xs" : "text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border ${textSize} ${config.cls} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}
