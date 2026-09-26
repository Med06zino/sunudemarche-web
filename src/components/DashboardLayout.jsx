import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const ROLE_COLORS = {
  "Espace Citoyen": { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "Espace Agent":   { dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700 border-blue-200" },
  "Espace Admin":   { dot: "bg-purple-400",  badge: "bg-purple-50 text-purple-700 border-purple-200" },
};

function NavItem({ item, basePath }) {
  const fullPath = item.to ? `${basePath}/${item.to}` : basePath;
  return (
    <NavLink
      to={fullPath}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
        ${isActive
          ? "bg-primary text-white shadow-sm shadow-primary/20"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            size={17}
            strokeWidth={isActive ? 2.5 : 2}
            className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 transition-colors"}
          />
          <span>{item.label}</span>
          {isActive && <ChevronRight size={13} className="ml-auto opacity-60" />}
        </>
      )}
    </NavLink>
  );
}

export default function DashboardLayout({ basePath, items, roleLabel }) {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleStyle = ROLE_COLORS[roleLabel] ?? ROLE_COLORS["Espace Citoyen"];
  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || user.email?.[0]?.toUpperCase()
    : "?";

  const Sidebar = () => (
    <aside className="w-64 h-full flex flex-col bg-white border-r border-slate-100">
      {/* Logo & rôle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <Logo className="h-9" />
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleStyle.badge} hidden sm:inline-flex items-center gap-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${roleStyle.dot}`} />
          {roleLabel.replace("Espace ", "")}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map((item) => (
          <NavItem key={item.to ?? "index"} item={item} basePath={basePath} />
        ))}
      </nav>

      {/* Profil utilisateur & déconnexion */}
      <div className="p-3 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate leading-tight">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium
            text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <LogOut size={15} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-30">
        <Sidebar />
      </div>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <div
        className={`fixed inset-y-0 left-0 w-64 z-50 md:hidden transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar mobile */}
        <header className="md:hidden h-14 flex items-center justify-between px-4 bg-white border-b border-slate-100 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>
          <Logo className="h-8" />
          <div className="w-9" /> {/* spacer */}
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
