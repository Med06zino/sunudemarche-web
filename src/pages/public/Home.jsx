import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus, FileSearch, Send, CheckCircle2,
  ShieldCheck, Clock, MapPin, ArrowRight, FileText,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import landing from "../../assets/landing.jpg";
import slideSenegal from "../../assets/slide-senegal.png";
import slideDossiers from "../../assets/slide-dossiers.png";

/* ═════════════════════════ Contenu ═════════════════════════ */

const STEPS = [
  { icon: UserPlus,     title: "Créez votre compte",       desc: "Inscription rapide avec votre adresse email." },
  { icon: FileSearch,   title: "Choisissez le service",    desc: "Sélectionnez votre démarche et votre centre." },
  { icon: Send,         title: "Remplissez le formulaire", desc: "Quelques informations suffisent pour constituer votre dossier." },
  { icon: CheckCircle2, title: "Récupérez votre acte",     desc: "Notifié dès que votre document est prêt à retirer." },
];

const TRUST = [
  { icon: ShieldCheck, title: "100 % sécurisé",           desc: "Chiffrement TLS, données personnelles protégées conformément à la loi.",   color: "text-blue-600 bg-blue-50 border-blue-100" },
  { icon: Clock,       title: "Suivi en temps réel",      desc: "Consultez l'avancement de vos dossiers 24h/24, 7j/7.",                      color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { icon: MapPin,      title: "Zéro déplacement inutile", desc: "Évitez les files d'attente. Vous vous déplacez seulement pour récupérer.", color: "text-amber-600 bg-amber-50 border-amber-100" },
];

/* ═════════════════════════ Slides (photos) ═════════════════════════
   Photos Unsplash (licence gratuite). Pour la production, télécharge-les dans
   src/assets/ et remplace l'URL par un import (plus rapide et plus fiable) :
     import slide1 from "../../assets/slide1.jpg";  →  image: slide1
   Si une URL ne charge pas, `landing.jpg` s'affiche à la place. */

const unsplash = (id) => `https://unsplash.com/photos/${id}/download?force=true&w=1920`;

const SLIDES = [
  { image: unsplash("IbhDrmssndU"), alt: "Vue aérienne de Dakar" },
  { image: slideSenegal,            alt: "Drapeau du Sénégal sur une plage avec des pirogues" },
  { image: slideDossiers,           alt: "Piles de dossiers administratifs papier" },
];

const SLIDE_INTERVAL = 6000;

/* ═════════════════════════ Utilitaires ═════════════════════════ */

/** Apparition en fondu + glissement quand l'élément entre dans le viewport (une seule fois). */
function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ═════════════════════════ Sections ═════════════════════════ */

function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const count = SLIDES.length;

  const go = (i) => setIndex((i + count) % count);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [paused, count, index]);

  /* Balayage tactile (mobile) */
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    touchX.current = null;
    setPaused(false);
  };

  const arrow =
    "absolute top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/20 p-2 text-white backdrop-blur transition hover:bg-black/40 md:block";

  return (
    <section
      className="relative isolate h-[320px] overflow-hidden bg-primary-dark sm:h-[590px] lg:h-[660px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carrousel"
    >
      {SLIDES.map(({ image, alt }, i) => (
        <img
          key={i}
          src={image}
          alt={alt}
          aria-hidden={i !== index}
          loading={i === 0 ? "eager" : "lazy"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = landing;
          }}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <button type="button" onClick={() => go(index - 1)} className={`${arrow} left-4`} aria-label="Image précédente">
        <ChevronLeft size={20} />
      </button>
      <button type="button" onClick={() => go(index + 1)} className={`${arrow} right-4`} aria-label="Image suivante">
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Aller à l'image ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white"}`}
          />
        ))}
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="relative z-10 mx-auto -mt-6 max-w-5xl px-4 pb-16 sm:px-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {TRUST.map(({ icon: Icon, title, desc, color }, i) => (
          <Reveal
            key={title}
            delay={i * 120}
            className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="border-y border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="mb-12 text-center sm:mb-14">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Comment ça se passe ?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
            Quatre étapes simples pour obtenir vos documents officiels sans vous déplacer.
          </p>
        </Reveal>

        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal as="li" key={title} delay={i * 150} className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
                <Icon size={22} />
              </span>
              <span className="mt-4 text-xs font-semibold text-primary">Étape {i + 1}</span>
              <h3 className="mt-1 text-sm font-bold text-slate-900">{title}</h3>
              <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed text-slate-500">{desc}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FeaturedService({ ctaHref }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-primary-dark p-6 text-white shadow-xl shadow-primary/20 sm:flex-row sm:items-center sm:p-12">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <FileText size={20} />
              </span>
              <span className="text-sm font-medium text-white/80">Service disponible</span>
            </div>
            <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Extrait de naissance</h2>
            <p className="max-w-md text-sm leading-relaxed text-white/80">
              Faites votre demande en ligne et suivez l'avancement de votre dossier en toute sérénité.
              Simple, rapide et sécurisé.
            </p>
          </div>

          <Link
            to={ctaHref}
            className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50 sm:w-auto"
          >
            Faire ma demande
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ═════════════════════════ Page ═════════════════════════ */

export default function Home() {
  const { user } = useAuth();

  // Citoyen connecté → nouvelle demande ; sinon → inscription.
  const ctaHref = user?.role === "CITIZEN" ? "/citoyen/nouvelle-demande" : "/inscription";

  return (
    <div className="bg-background text-text">
      <Hero />
      <TrustSection />
      <StepsSection />
      <FeaturedService ctaHref={ctaHref} />
    </div>
  );
}








// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   UserPlus, FileSearch, Send, CheckCircle2,
//   ShieldCheck, Clock, MapPin, ArrowRight,
//   FileText, Landmark, ChevronDown,
// } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// /* L'image est importée (et non référencée par une URL) : Vite la hache, l'optimise
//    et le build échoue clairement si le fichier est absent.
//    → Adapte l'extension si besoin (.jpg, .jpeg, .png, .webp). */
// import landing from "../../assets/landing.jpg";

// /* ═════════════════════════ Contenu ═════════════════════════ */

// const HERO = {
//   badge: "Plateforme officielle des démarches au Sénégal",
//   title: "Vos démarches administratives, en ligne et sans stress.",
//   text: "Demandez vos actes officiels depuis chez vous, suivez leur avancement en temps réel et ne vous déplacez qu'une seule fois, pour récupérer votre document.",
// };

// const STEPS = [
//   { icon: UserPlus,     title: "Créez votre compte",       desc: "Inscription rapide avec votre adresse email." },
//   { icon: FileSearch,   title: "Choisissez le service",    desc: "Sélectionnez votre démarche et votre centre." },
//   { icon: Send,         title: "Remplissez le formulaire", desc: "Quelques informations suffisent pour constituer votre dossier." },
//   { icon: CheckCircle2, title: "Récupérez votre acte",     desc: "Notifié dès que votre document est prêt à retirer." },
// ];

// const TRUST = [
//   { icon: ShieldCheck, title: "100 % sécurisé",            desc: "Chiffrement TLS, données personnelles protégées conformément à la loi.", color: "text-blue-600 bg-blue-50 border-blue-100" },
//   { icon: Clock,       title: "Suivi en temps réel",       desc: "Consultez l'avancement de vos dossiers 24h/24, 7j/7.",                  color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
//   { icon: MapPin,      title: "Zéro déplacement inutile",  desc: "Évitez les files d'attente. Vous vous déplacez seulement pour récupérer.", color: "text-amber-600 bg-amber-50 border-amber-100" },
// ];

// /** Statuts parcourus en boucle dans l'aperçu : « En attente » → « En cours » → « Validé ». */
// const STATUSES = [
//   { label: "En attente", tone: "bg-slate-100 text-slate-600" },
//   { label: "En cours",   tone: "bg-amber-50 text-amber-700" },
//   { label: "Validé",     tone: "bg-emerald-50 text-emerald-700" },
// ];

// const PREVIEW_ROWS = [
//   { icon: FileText,    title: "Acte de naissance",       reference: "Dossier n° 2841", offset: 2 },
//   { icon: Landmark,    title: "Certificat de résidence", reference: "Dossier n° 2842", offset: 1 },
//   { icon: ShieldCheck, title: "Casier judiciaire",       reference: "Dossier n° 2843", offset: 0 },
// ];

// /* ═════════════════════════ Animations ═════════════════════════ */

// /** Keyframes locales : aucune config Tailwind à modifier. */
// const ANIMATION_CSS = `
// @keyframes home-kenburns { from { transform: scale(1); } to { transform: scale(1.12); } }
// @keyframes home-float    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
// @keyframes home-shine    { from { transform: translateX(-120%); } to { transform: translateX(220%); } }
// @keyframes home-word     { from { opacity: 0; transform: translateY(0.6em); filter: blur(6px); }
//                            to   { opacity: 1; transform: translateY(0);     filter: blur(0); } }
// @keyframes home-pop      { 0% { transform: scale(.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
// @keyframes home-pulse    { 0% { box-shadow: 0 0 0 0 rgb(52 211 153 / .6); } 100% { box-shadow: 0 0 0 8px rgb(52 211 153 / 0); } }

// @keyframes home-bounce   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }

// .home-bounce   { animation: home-bounce 1.6s ease-in-out infinite; }
// .home-kenburns { animation: home-kenburns 24s ease-out forwards; }
// .home-float    { animation: home-float 6s ease-in-out infinite; }
// .home-shine    { animation: home-shine 3.2s ease-in-out infinite; }
// .home-word     { opacity: 0; animation: home-word .7s cubic-bezier(.2,.7,.2,1) forwards; }
// .home-pop      { animation: home-pop .35s ease-out; }
// .home-pulse    { animation: home-pulse 1.8s ease-out infinite; }

// @media (prefers-reduced-motion: reduce) {
//   .home-kenburns, .home-float, .home-shine, .home-pop, .home-pulse, .home-bounce { animation: none !important; }
//   .home-word { animation: none !important; opacity: 1; }
// }
// `;

// const prefersReducedMotion = () =>
//   typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// /** Passe à `true` (une seule fois) quand l'élément entre dans le viewport. */
// function useInView(threshold = 0.15) {
//   const ref = useRef(null);
//   const [inView, setInView] = useState(false);

//   useEffect(() => {
//     const node = ref.current;
//     if (!node) return;
//     if (typeof IntersectionObserver === "undefined") {
//       setInView(true);
//       return;
//     }
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setInView(true);
//           observer.disconnect();
//         }
//       },
//       { threshold, rootMargin: "0px 0px -40px 0px" }
//     );
//     observer.observe(node);
//     return () => observer.disconnect();
//   }, [threshold]);

//   return [ref, inView];
// }

// /** Décale verticalement l'élément au scroll (effet de profondeur), sans re-render React. */
// function useParallax(speed = 0.2) {
//   const ref = useRef(null);

//   useEffect(() => {
//     if (prefersReducedMotion()) return;
//     let frame = 0;
//     const update = () => {
//       frame = 0;
//       if (ref.current) ref.current.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
//     };
//     const onScroll = () => {
//       if (!frame) frame = requestAnimationFrame(update);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       cancelAnimationFrame(frame);
//     };
//   }, [speed]);

//   return ref;
// }

// /** Compteur qui avance à intervalle régulier (aperçu animé du suivi de dossiers). */
// function useTick(intervalMs = 2600) {
//   const [tick, setTick] = useState(0);

//   useEffect(() => {
//     if (prefersReducedMotion()) return;
//     const id = setInterval(() => setTick((t) => t + 1), intervalMs);
//     return () => clearInterval(id);
//   }, [intervalMs]);

//   return tick;
// }

// /* ═════════════════════════ Briques réutilisables ═════════════════════════ */

// /** Apparition en fondu + glissement, avec délai pour les effets en cascade. */
// function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
//   const [ref, inView] = useInView();
//   return (
//     <Tag
//       ref={ref}
//       style={{ transitionDelay: `${delay}ms` }}
//       className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
//         inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
//       } ${className}`}
//       {...rest}
//     >
//       {children}
//     </Tag>
//   );
// }

// /** Titre dont les mots apparaissent l'un après l'autre (séquence d'ouverture du hero). */
// function AnimatedWords({ text, startDelay = 0, step = 70, className = "" }) {
//   return (
//     <h1 className={className} aria-label={text}>
//       {text.split(" ").map((word, i) => (
//         <span
//           key={i}
//           aria-hidden="true"
//           className="home-word inline-block"
//           style={{ animationDelay: `${startDelay + i * step}ms` }}
//         >
//           {word}&nbsp;
//         </span>
//       ))}
//     </h1>
//   );
// }

// /** Image de fond : parallaxe au scroll + zoom lent. Deux couches pour que les transforms ne se marchent pas dessus. */
// function BackgroundImage({ parallax = 0, zoom = false, className = "" }) {
//   const parallaxRef = useParallax(parallax);
//   return (
//     <div
//       ref={parallax ? parallaxRef : null}
//       className={`pointer-events-none absolute inset-x-0 -bottom-20 -top-20 overflow-hidden ${className}`}
//       aria-hidden="true"
//     >
//       <img
//         src={landing}
//         alt=""
//         onError={() => console.error("landing : image introuvable ou illisible →", landing)}
//         className={`absolute inset-0 h-full w-full max-w-none object-cover object-center ${zoom ? "home-kenburns" : ""}`}
//       />
//     </div>
//   );
// }

// const BTN_BASE =
//   "group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-all duration-200 " +
//   "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

// function PrimaryLink({ to, children }) {
//   return (
//     <Link
//       to={to}
//       className={`${BTN_BASE} relative overflow-hidden bg-white text-primary shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:shadow-xl`}
//     >
//       <span
//         className="home-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
//         aria-hidden="true"
//       />
//       <span className="relative">{children}</span>
//       <ArrowRight size={17} className="relative transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
//     </Link>
//   );
// }

// function GhostLink({ to, children }) {
//   return (
//     <Link
//       to={to}
//       className={`${BTN_BASE} border border-white/30 bg-white/10 text-white backdrop-blur hover:border-white/60 hover:bg-white/20`}
//     >
//       {children}
//     </Link>
//   );
// }

// /* ═════════════════════════ Sections ═════════════════════════ */

// function TrackingPreview() {
//   const tick = useTick();

//   return (
//     <div className="home-float rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-md">
//       <div className="overflow-hidden rounded-xl bg-white text-slate-800">
//         <div className="flex h-8 items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3">
//           <span className="h-2 w-2 rounded-full bg-red-400" />
//           <span className="h-2 w-2 rounded-full bg-amber-400" />
//           <span className="h-2 w-2 rounded-full bg-emerald-400" />
//         </div>

//         <div className="space-y-2.5 p-3.5">
//           {PREVIEW_ROWS.map(({ icon: Icon, title, reference, offset }) => {
//             const stage = (offset + tick) % STATUSES.length;
//             const { label, tone } = STATUSES[stage];
//             return (
//               <div key={reference} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
//                 <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
//                   <Icon size={17} />
//                 </span>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-semibold">{title}</p>
//                   <p className="truncate text-xs text-slate-400">{reference}</p>
//                 </div>
//                 {/* `key` change → le badge est remonté et rejoue l'animation « pop » */}
//                 <span key={label} className={`home-pop shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
//                   {label}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// function Hero({ ctaHref }) {
//   return (
//     <section className="relative isolate overflow-hidden bg-primary-dark text-white">
//       <BackgroundImage parallax={0.18} zoom className="-z-20" />

//       {/* Voile de couleur : garantit le contraste du texte */}
//       <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-dark/90 via-primary-dark/55 to-primary-dark/15" aria-hidden="true" />
//       <div className="absolute -right-24 top-1/4 -z-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

//       <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-32 pt-16 sm:px-6 lg:min-h-[640px] lg:grid-cols-[1.1fr_0.9fr] lg:pb-40 lg:pt-20">
//         <div>
//           <Reveal>
//             <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur">
//               <span className="home-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
//               {HERO.badge}
//             </p>
//           </Reveal>

//           <AnimatedWords
//             text={HERO.title}
//             startDelay={150}
//             className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
//           />

//           <Reveal delay={700}>
//             <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">{HERO.text}</p>
//           </Reveal>

//           <Reveal delay={850} className="mt-10 flex flex-col gap-3 sm:flex-row">
//             <PrimaryLink to={ctaHref}>Commencer ma démarche</PrimaryLink>
//             <GhostLink to="/services">Voir les services</GhostLink>
//           </Reveal>
//         </div>

//         <Reveal delay={600} className="hidden lg:block" aria-hidden="true">
//           <TrackingPreview />
//         </Reveal>
//       </div>

//       {/* Indicateur de défilement vers la section suivante */}
//       <a
//         href="#comment-ca-marche"
//         className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 rounded-full border border-white/30 bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:block"
//         aria-label="Découvrir comment ça se passe"
//       >
//         <ChevronDown size={20} className="home-bounce" aria-hidden="true" />
//       </a>
//     </section>
//   );
// }

// function TrustSection() {
//   return (
//     <section className="relative z-10 mx-auto -mt-6 max-w-5xl px-4 pb-16 sm:px-6">
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
//         {TRUST.map(({ icon: Icon, title, desc, color }, i) => (
//           <Reveal
//             key={title}
//             delay={i * 120}
//             className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card hover:-translate-y-1 hover:shadow-card-hover"
//           >
//             <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${color}`}>
//               <Icon size={22} />
//             </div>
//             <div>
//               <p className="text-sm font-bold text-slate-900">{title}</p>
//               <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
//             </div>
//           </Reveal>
//         ))}
//       </div>
//     </section>
//   );
// }

// function StepsSection() {
//   const [lineRef, lineVisible] = useInView(0.5);

//   return (
//     <section id="comment-ca-marche" className="scroll-mt-4 border-y border-slate-100 bg-white py-20">
//       <div className="mx-auto max-w-5xl px-4 sm:px-6">
//         <Reveal className="mb-14 text-center">
//           <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Comment ça se passe ?</h2>
//           <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
//             Quatre étapes simples pour obtenir vos documents officiels sans vous déplacer.
//           </p>
//         </Reveal>

//         <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
//           {/* Ligne de progression qui se dessine au scroll (desktop) */}
//           <div
//             ref={lineRef}
//             className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-slate-200 lg:block"
//             aria-hidden="true"
//           >
//             <div
//               className={`h-full origin-left bg-primary transition-transform duration-[1400ms] ease-out motion-reduce:transition-none ${
//                 lineVisible ? "scale-x-100" : "scale-x-0"
//               }`}
//             />
//           </div>

//           {STEPS.map(({ icon: Icon, title, desc }, i) => (
//             <Reveal as="li" key={title} delay={i * 150} className="relative flex flex-col items-center text-center">
//               <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-primary text-white shadow-lg shadow-primary/30">
//                 <Icon size={22} />
//               </span>
//               <span className="mt-4 text-xs font-semibold text-primary">Étape {i + 1}</span>
//               <h3 className="mt-1 text-sm font-bold text-slate-900">{title}</h3>
//               <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed text-slate-500">{desc}</p>
//             </Reveal>
//           ))}
//         </ol>
//       </div>
//     </section>
//   );
// }

// function FeaturedService({ ctaHref }) {
//   return (
//     <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
//       <Reveal>
//         <div className="group relative isolate overflow-hidden rounded-3xl bg-primary-dark p-8 text-white shadow-xl shadow-primary/20 sm:p-12">
//           <div
//             className="absolute inset-0 -z-20 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
//             style={{ backgroundImage: `url(${landing})` }}
//             aria-hidden="true"
//           />
//           <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-dark/90 via-primary-dark/60 to-primary-dark/20" aria-hidden="true" />

//           <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
//             <div className="flex-1">
//               <div className="mb-4 flex items-center gap-3">
//                 <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
//                   <FileText size={20} />
//                 </span>
//                 <span className="text-sm font-medium text-white/80">Service disponible</span>
//               </div>
//               <h2 className="mb-3 text-2xl font-bold leading-tight sm:text-3xl">Extrait de naissance</h2>
//               <p className="max-w-md text-sm leading-relaxed text-white/80">
//                 Faites votre demande en ligne et suivez l'avancement de votre dossier en toute sérénité.
//                 Simple, rapide et sécurisé.
//               </p>
//             </div>

//             <Link
//               to={ctaHref}
//               className="group/btn inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
//             >
//               Faire ma demande
//               <ArrowRight size={16} className="transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
//             </Link>
//           </div>
//         </div>
//       </Reveal>
//     </section>
//   );
// }

// /* ═════════════════════════ Page ═════════════════════════ */

// export default function Home() {
//   const { user } = useAuth();

//   // Citoyen connecté → directement vers une nouvelle demande ; sinon → inscription.
//   const ctaHref = user?.role === "CITIZEN" ? "/citoyen/nouvelle-demande" : "/inscription";

//   return (
//     <div className="bg-background text-text">
//       <style>{ANIMATION_CSS}</style>
//       <Hero ctaHref={ctaHref} />
//       <TrustSection />
//       <StepsSection />
//       <FeaturedService ctaHref={ctaHref} />
//     </div>
//   );
// }








// import { Link } from "react-router-dom";
// import {
//   UserPlus, FileSearch, Send, CheckCircle2,
//   ShieldCheck, Clock, MapPin, ArrowRight,
//   Star, FileText, ChevronRight,
// } from "lucide-react";
// import { Button } from "../../components/ui";
// import { useAuth } from "../../context/AuthContext";

// const STEPS = [
//   { n: "01", icon: UserPlus,    title: "Créez votre compte",     desc: "Inscription rapide avec votre adresse email." },
//   { n: "02", icon: FileSearch,  title: "Choisissez le service",   desc: "Sélectionnez votre démarche et votre centre." },
//   { n: "03", icon: Send,        title: "Remplissez le formulaire", desc: "Quelques informations suffisent pour constituer votre dossier." },
//   { n: "04", icon: CheckCircle2, title: "Récupérez votre acte",   desc: "Notifié dès que votre document est prêt à retirer." },
// ];

// const TRUST = [
//   {
//     icon: ShieldCheck,
//     title: "100 % sécurisé",
//     desc: "Chiffrement TLS, données personnelles protégées conformément à la loi.",
//     color: "text-blue-600 bg-blue-50 border-blue-100",
//   },
//   {
//     icon: Clock,
//     title: "Suivi en temps réel",
//     desc: "Consultez l'avancement de vos dossiers 24h/24, 7j/7.",
//     color: "text-emerald-600 bg-emerald-50 border-emerald-100",
//   },
//   {
//     icon: MapPin,
//     title: "Zéro déplacement inutile",
//     desc: "Évitez les files d'attente. Vous vous déplacez seulement pour récupérer.",
//     color: "text-amber-600 bg-amber-50 border-amber-100",
//   },
// ];

// export default function Home() {
//   const { user } = useAuth();

//   // Si l'utilisateur est déjà connecté en tant que citoyen, le CTA le
//   // redirige directement vers le formulaire de nouvelle demande.
//   // Sinon, il va vers l'inscription (parcours visiteur standard).
//   const ctaHref = user?.role === "CITIZEN" ? "/citoyen/nouvelle-demande" : "/inscription";
//   return (
//     <div className="bg-background text-text">

//       {/* ── HERO ──────────────────────────────────────────────────────── */}
//       <section className="relative overflow-hidden bg-white border-b border-slate-100">
//         {/* Fond décoratif subtil */}
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
//           <div className="absolute -bottom-16 -left-16 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl" />
//         </div>

//         <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 text-center">
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-6 border border-primary/15">
//             {/* <Star size={12} className="fill-primary" /> */}
//             Plateforme officielle des démarches au Sénégal
//           </div>

//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
//             Vos démarches administratives,
//             {/* <br className="hidden sm:block" /> */}
//             <span className="text-primary"> en ligne et sans stress.</span>
//           </h1>

//           <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
//             Demandez vos actes officiels depuis chez vous, suivez leur avancement en temps réel et ne vous déplacez qu'une seule fois — pour récupérer votre document.
//           </p>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
//             <Link to={ctaHref}>
//               <Button size="lg" className="w-full sm:w-auto shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30">
//                 Commencer ma démarche
//                 <ArrowRight size={17} />
//               </Button>
//             </Link>
//             <Link to="/services">
//               <Button size="lg" variant="outline" className="w-full sm:w-auto">
//                 Voir les services
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── CONFIANCE ─────────────────────────────────────────────────── */}
//       <section className="max-w-5xl mx-auto px-4 py-14">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//           {TRUST.map(({ icon: Icon, title, desc, color }) => (
//             <div
//               key={title}
//               className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200"
//             >
//               <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${color}`}>
//                 <Icon size={22} />
//               </div>
//               <div>
//                 <p className="font-bold text-slate-900 text-sm">{title}</p>
//                 <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────────── */}
//       <section className="bg-white border-y border-slate-100 py-16">
//         <div className="max-w-5xl mx-auto px-4">
//           <div className="text-center mb-12">
//             <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mb-3">
//               Simple & rapide
//             </span>
//             <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Comment ça se passe ?</h2>
//             <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
//               Quatre étapes simples pour obtenir vos documents officiels sans vous déplacer.
//             </p>
//           </div>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
//             {STEPS.map((step, i) => {
//               const Icon = step.icon;
//               return (
//                 <div
//                   key={step.n}
//                   className="relative bg-background p-6 rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-200 group"
//                 >
//                   <span className="absolute top-4 right-4 text-[11px] font-bold text-slate-200 select-none">
//                     {step.n}
//                   </span>
//                   <div className="w-11 h-11 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
//                     <Icon size={20} />
//                   </div>
//                   <h3 className="font-bold text-slate-900 text-sm mb-1.5">{step.title}</h3>
//                   <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
//                   {i < STEPS.length - 1 && (
//                     <div className="hidden lg:flex absolute top-1/2 -right-3 z-10">
//                       <ChevronRight size={16} className="text-slate-300" />
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* ── SERVICE EN VEDETTE ────────────────────────────────────────── */}
//       <section className="max-w-4xl mx-auto px-4 py-16">
//         <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-primary/20">
//           {/* Déco */}
//           <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
//           <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

//           <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
//                   <FileText size={20} />
//                 </div>
//                 <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Service disponible</span>
//               </div>
//               <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
//                 Extrait de Naissance
//               </h2>
//               <p className="text-white/75 text-sm leading-relaxed max-w-md">
//                 Faites votre demande en ligne et suivez l'avancement de votre dossier en toute sérénité. Simple, rapide et sécurisé.
//               </p>
//             </div>
//             <Link to={ctaHref} className="shrink-0">
//               <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-bold text-sm hover:bg-slate-50 transition-colors shadow-lg">
//                 Faire ma demande
//                 <ArrowRight size={16} />
//               </button>
//             </Link>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }
