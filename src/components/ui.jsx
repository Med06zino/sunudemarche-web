import { FileX, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

// ─── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 " +
    "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-2";

  const sizes = {
    sm: "px-3.5 py-2 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/20 " +
      "hover:shadow-md hover:shadow-primary/25 focus-visible:ring-primary",
    secondary:
      "bg-secondary text-white hover:bg-secondary-dark shadow-sm shadow-secondary/20 " +
      "hover:shadow-md focus-visible:ring-secondary",
    outline:
      "border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 " +
      "hover:border-slate-300 shadow-sm focus-visible:ring-primary",
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20 " +
      "hover:shadow-md focus-visible:ring-red-500",
    ghost:
      "text-primary hover:bg-primary/8 shadow-none focus-visible:ring-primary",
    subtle:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none focus-visible:ring-slate-400",
  };

  return (
    <button
      className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, hint, className = "", ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-white text-sm outline-none
          placeholder:text-slate-400 transition-all duration-200
          ${error
            ? "border-red-300 ring-1 ring-red-200 focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
            : "border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
          disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ─── Textarea ──────────────────────────────────────────────────────────────────
export function Textarea({ label, error, hint, className = "", ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 rounded-xl border text-slate-900 bg-white text-sm outline-none
          placeholder:text-slate-400 transition-all duration-200 resize-y
          ${error
            ? "border-red-300 ring-1 ring-red-200 focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
            : "border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ─── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-white text-sm outline-none
          transition-all duration-200 cursor-pointer appearance-none
          ${error
            ? "border-red-300 ring-1 ring-red-200 focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
            : "border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
          ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs font-medium text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`bg-white border border-slate-100 rounded-2xl shadow-card p-6
        ${hover ? "transition-all duration-200 hover:shadow-card-hover hover:border-slate-200" : ""}
        ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Alert ─────────────────────────────────────────────────────────────────────
const ALERT_CONFIG = {
  info:    { cls: "bg-blue-50 text-blue-800 border-blue-200",    Icon: Info },
  success: { cls: "bg-emerald-50 text-emerald-800 border-emerald-200", Icon: CheckCircle2 },
  error:   { cls: "bg-red-50 text-red-800 border-red-200",       Icon: AlertCircle },
  warning: { cls: "bg-amber-50 text-amber-800 border-amber-200", Icon: AlertTriangle },
};

export function Alert({ variant = "info", children, className = "" }) {
  const { cls, Icon } = ALERT_CONFIG[variant] ?? ALERT_CONFIG.info;
  return (
    <div className={`flex gap-3 px-4 py-3.5 rounded-xl border text-sm leading-relaxed ${cls} ${className}`}>
      <Icon size={16} className="shrink-0 mt-0.5 opacity-80" />
      <div>{children}</div>
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default:  "bg-slate-100 text-slate-600 border-slate-200",
    primary:  "bg-primary/10 text-primary border-primary/20",
    success:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning:  "bg-amber-50 text-amber-700 border-amber-200",
    error:    "bg-red-50 text-red-700 border-red-200",
    info:     "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] ?? variants.default} ${className}`}>
      {children}
    </span>
  );
}

// ─── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = "md", className = "" }) {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-7 h-7 border-2", lg: "w-10 h-10 border-[3px]" };
  return (
    <div className={`${sizes[size] ?? sizes.md} rounded-full border-slate-200 border-t-primary animate-spin ${className}`} />
  );
}

// ─── PageLoader ────────────────────────────────────────────────────────────────
export function PageLoader({ message = "Chargement..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 animate-fade-in">
      <Spinner size="lg" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

// ─── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ title, description, icon: Icon = FileX, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 mx-auto mb-4 flex items-center justify-center text-slate-300 shadow-sm">
        <Icon size={26} />
      </div>
      <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── SectionHeader ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action, border = true }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${border ? "border-b border-slate-100 pb-6" : ""}`}>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
