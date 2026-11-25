import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye, EyeOff, Loader2, ArrowLeft, AlertCircle, Lock,
  FileText, Landmark, ShieldCheck, GitFork,
} from "lucide-react";
import logo from "../assets/logo.png.png";

/* ═════════════════════════ Données du panneau de droite ═════════════════════════ */

const SLIDE_INTERVAL_MS = 6000;

const SLIDES = [
  {
    title: "Toutes vos démarches, au même endroit.",
    text: "Déposez, suivez et recevez vos documents administratifs en ligne.",
  },
  {
    title: "Un suivi clair, à chaque étape.",
    text: "Consultez l'état de votre dossier et soyez averti dès qu'il avance.",
  },
  {
    title: "Des échanges sécurisés avec l'administration.",
    text: "Vos données et vos pièces sont protégées et accessibles à tout moment.",
  },
];

const NODES = [
  { icon: FileText, top: 20 },
  { icon: Landmark, top: 50 },
  { icon: ShieldCheck, top: 80 },
];

const ROWS = [
  { icon: FileText, title: "Acte de naissance", ref: "Dossier n° 2841", status: "Validé", tone: "bg-emerald-50 text-emerald-700" },
  { icon: Landmark, title: "Certificat de résidence", ref: "Dossier n° 2842", status: "En cours", tone: "bg-amber-50 text-amber-700" },
  { icon: ShieldCheck, title: "Casier judiciaire", ref: "Dossier n° 2843", status: "En attente", tone: "bg-slate-100 text-slate-600" },
];

/* ═════════════════════════ Panneau de droite ═════════════════════════ */

function Illustration() {
  return (
    <div className="relative mx-auto aspect-[520/380] w-full max-w-[480px]" aria-hidden="true">
      {/* Cercles de fond */}
      <div className="absolute left-1/2 top-1/2 aspect-square h-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
      <div className="absolute left-1/2 top-1/2 aspect-square h-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      {/* Ligne pointillée + ornement */}
      <div className="absolute bottom-[20%] left-[12%] top-[20%] border-l-2 border-dashed border-white/30" />
      <div className="absolute left-[12%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20">
        <GitFork size={120} className="rotate-90 stroke-[1]" />
      </div>

      {/* Pastilles */}
      {NODES.map(({ icon: Icon, top }) => (
        <div
          key={top}
          className="absolute left-[12%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 p-1.5"
          style={{ top: `${top}%` }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-md">
            <Icon size={20} />
          </div>
        </div>
      ))}

      {/* Fenêtre de suivi des dossiers */}
      <div className="absolute bottom-[14%] left-[40%] right-0 top-[14%] flex flex-col overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/25">
        <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 space-y-2 p-2.5">
          {ROWS.map(({ icon: Icon, title, ref, status, tone }) => (
            <div key={ref} className="flex items-center gap-2 rounded-lg border border-slate-100 p-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold leading-tight text-slate-800">{title}</p>
                <p className="truncate text-[10px] leading-tight text-slate-400">{ref}</p>
              </div>
              <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Index du slide courant, avec rotation auto (désactivée si l'utilisateur préfère moins d'animations). */
function useSlideRotation(length, intervalMs) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % length), intervalMs);
    return () => clearInterval(id);
    // `index` en dépendance : un clic manuel relance le minuteur à zéro
  }, [length, intervalMs, index]);

  return [index, setIndex];
}

function Showcase() {
  const [index, setIndex] = useSlideRotation(SLIDES.length, SLIDE_INTERVAL_MS);
  const slide = SLIDES[index];

  return (
    <aside className="hidden flex-col items-center justify-center overflow-hidden bg-primary px-10 py-12 text-white lg:flex">
      <Illustration />

      <div className="mt-14 min-h-[88px] max-w-sm text-center" aria-live="polite">
        <h2 className="text-xl font-semibold leading-snug">{slide.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{slide.text}</p>
      </div>

      <div className="mt-6 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Message ${i + 1} sur ${SLIDES.length}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </aside>
  );
}

/* ═════════════════════════ Mise en page ═════════════════════════ */

/**
 * - Mobile : plein écran, sans cadre.
 * - ≥ sm : carte centrée (horizontalement et verticalement) sur fond gris.
 * - Si le contenu est long (inscription), la carte grandit et la page défile normalement.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 sm:p-6 lg:h-dvh lg:p-8">
      <div className="grid min-h-dvh w-full max-w-6xl overflow-hidden bg-white sm:min-h-[600px] sm:rounded-3xl sm:shadow-xl lg:h-full lg:max-h-[820px] lg:min-h-0 lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)]">
        <div className="flex flex-col px-6 py-5 sm:px-10 lg:overflow-y-auto lg:px-12 xl:px-16">
          <header className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5" aria-label="SunuDémarche — accueil">
              <img src={logo} alt="" className="h-8 w-auto object-contain" />
              <span className="text-lg font-semibold tracking-tight text-slate-900">SunuDémarche</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-primary"
            >
              {/* <ArrowLeft size={15} aria-hidden="true" /> Accueil */}
            </Link>
          </header>

          <main className="flex flex-1 items-center py-4">
            <div className="mx-auto w-full max-w-[420px]">{children}</div>
          </main>
        </div>

        <Showcase />
      </div>
    </div>
  );
}

/* ═════════════════════════ Éléments de formulaire ═════════════════════════ */

const baseInput =
  "block h-10 w-full rounded-lg border bg-slate-50 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 " +
  "transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/15";

const inputBorder = (invalid) => (invalid ? "border-red-300" : "border-slate-200");

export function AuthHeading({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>
    </div>
  );
}

export function FormAlert({ children }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

function FieldLabel({ id, label, optional }) {
  return (
    <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
      {label}
      {optional && <span className="font-normal text-slate-400"> (facultatif)</span>}
    </label>
  );
}

/** Affiche l'erreur en priorité, sinon l'aide. `warn` colore l'aide en ambre. */
function FieldMessage({ id, error, text, warn }) {
  if (error) {
    return <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>;
  }
  if (text) {
    return (
      <p id={`${id}-hint`} className={`mt-1.5 text-xs ${warn ? "text-amber-600" : "text-slate-500"}`}>
        {text}
      </p>
    );
  }
  return null;
}

const describedByFor = (id, error, text) =>
  error ? `${id}-error` : text ? `${id}-hint` : undefined;

export function TextField({ id, label, icon: Icon, error, invalid, hint, optional, ...props }) {
  const isInvalid = Boolean(error || invalid);

  return (
    <div>
      <FieldLabel id={id} label={label} optional={optional} />
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        )}
        <input
          {...props}
          id={id}
          aria-invalid={isInvalid}
          aria-describedby={describedByFor(id, error, hint)}
          className={`${baseInput} ${Icon ? "pl-10" : "pl-3.5"} ${inputBorder(isInvalid)}`}
        />
      </div>
      <FieldMessage id={id} error={error} text={hint} />
    </div>
  );
}

export function PasswordField({ id, label, error, invalid, hint, onKeyUp, onBlur, ...props }) {
  const [show, setShow] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const isInvalid = Boolean(error || invalid);

  const message = capsLock ? "Le verrouillage des majuscules est activé." : hint;

  return (
    <div>
      <FieldLabel id={id} label={label} />
      <div className="relative">
        <Lock
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          {...props}
          id={id}
          type={show ? "text" : "password"}
          aria-invalid={isInvalid}
          aria-describedby={describedByFor(id, error, message)}
          onKeyUp={(e) => {
            setCapsLock(e.getModifierState?.("CapsLock") ?? false);
            onKeyUp?.(e);
          }}
          onBlur={(e) => {
            setCapsLock(false);
            onBlur?.(e);
          }}
          className={`${baseInput} pl-10 pr-11 ${inputBorder(isInvalid)}`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-primary"
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={show}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <FieldMessage id={id} error={error} text={message} warn={capsLock} />
    </div>
  );
}

export function SubmitButton({ loading, loadingText, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white shadow-sm
        transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
        disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}