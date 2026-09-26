import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const NAV_LINKS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/services", label: "Services" },
  { to: "/a-propos", label: "À propos" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function PublicHeader() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardRoute = !user ? "/connexion"
    : user.role === "AGENT" ? "/agent"
    : user.role === "ADMIN" ? "/admin"
    : "/citoyen";

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-200
          ${scrolled ? "border-slate-200 shadow-sm" : "border-slate-100"}`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo className="h-10" />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? "text-primary bg-primary/8" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Link
                to={dashboardRoute}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white
                  text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20"
              >
                <LayoutDashboard size={15} />
                Mon espace
              </Link>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                    text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <LogIn size={15} className="text-slate-400" />
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white
                    text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20"
                >
                  <UserPlus size={15} />
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Burger mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={mobileOpen ? "Fermer" : "Menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 animate-slide-up">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive ? "bg-primary/8 text-primary" : "text-slate-700 hover:bg-slate-50"}`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {user ? (
                <Link
                  to={dashboardRoute}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                    bg-primary text-white text-sm font-semibold"
                >
                  <LayoutDashboard size={15} /> Mon espace
                </Link>
              ) : (
                <>
                  <Link
                    to="/connexion"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                      border border-slate-200 text-slate-700 text-sm font-semibold"
                  >
                    <LogIn size={15} /> Connexion
                  </Link>
                  <Link
                    to="/inscription"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                      bg-primary text-white text-sm font-semibold"
                  >
                    <UserPlus size={15} /> S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
