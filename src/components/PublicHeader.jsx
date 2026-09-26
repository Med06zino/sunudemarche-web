import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User as UserIcon, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png.png";

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors relative py-1 ${
    isActive 
      ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full" 
      : "text-slate-600 hover:text-primary"
  }`;

export default function PublicHeader() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardRoute = () => {
    if (!user) return "/connexion";
    if (user.role === "AGENT") return "/agent";
    if (user.role === "ADMIN") return "/admin";
    return "/citoyen";
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 focus:outline-none">
          <img
            src={logo}
            alt="SunuDémarche"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>Accueil</NavLink>
          <NavLink to="/services" className={navLinkClass}>Services</NavLink>
          <NavLink to="/a-propos" className={navLinkClass}>À propos</NavLink>
          <NavLink to="/faq" className={navLinkClass}>FAQ</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        {/* BOUTONS D'ACTION DESKTOP */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to={getDashboardRoute()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm hover:shadow"
            >
              <LayoutDashboard size={16} />
              <span>Mon espace</span>
            </Link>
          ) : (
            <>
              <Link 
                to="/connexion" 
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
              >
                <LogIn size={16} className="text-slate-400" />
                <span>Connexion</span>
              </Link>
              <Link
                to="/inscription"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm hover:shadow"
              >
                <UserPlus size={16} />
                <span>Inscription</span>
              </Link>
            </>
          )}
        </div>

        {/* BOUTON MENU MOBILE */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE DÉROULANT */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-100 shadow-xl px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            <NavLink 
              to="/" 
              end 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-semibold ${isActive ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-50"}`}
            >
              Accueil
            </NavLink>
            <NavLink 
              to="/services" 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-semibold ${isActive ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-50"}`}
            >
              Services
            </NavLink>
            <NavLink 
              to="/a-propos" 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-semibold ${isActive ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-50"}`}
            >
              À propos
            </NavLink>
            <NavLink 
              to="/faq" 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-semibold ${isActive ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-50"}`}
            >
              FAQ
            </NavLink>
            <NavLink 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-semibold ${isActive ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-50"}`}
            >
              Contact
            </NavLink>
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Link
                to={getDashboardRoute()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold"
              >
                <LayoutDashboard size={16} />
                <span>Mon espace</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  <LogIn size={16} />
                  <span>Connexion</span>
                </Link>
                <Link
                  to="/inscription"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold"
                >
                  <UserPlus size={16} />
                  <span>Inscription</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}