import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { 
  LayoutDashboard, FilePlus, FileText, Bell, User, Settings, 
  Users, UserCog, Building2, Landmark, Layers, ShieldCheck 
} from "lucide-react";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import PublicHeader from "./components/PublicHeader";
import PublicFooter from "./components/PublicFooter";

// Pages Publiques
import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import About from "./pages/public/About";
import Faq from "./pages/public/Faq";
import Contact from "./pages/public/Contact";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

// Pages Citoyen (Attention au nom du fichier Dashboard.jsx)
import CitizenDashboard from "./pages/citizen/Dashboard";
import NewRequest from "./pages/citizen/NewRequest";
import MyRequests from "./pages/citizen/MyRequests";
import RequestDetail from "./pages/citizen/RequestDetail";
import CitizenNotifications from "./pages/citizen/Notifications";
import CitizenProfile from "./pages/citizen/Profile";
import CitizenSettings from "./pages/citizen/Settings";

// Pages Agent
import AgentDashboard from "./pages/agent/Dashboard";
import AgentRequestList from "./pages/agent/RequestList";
import AgentRequestDetail from "./pages/agent/RequestDetail";
import AgentNotifications from "./pages/agent/Notifications";
import AgentProfile from "./pages/agent/Profile";

// Pages Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminAgents from "./pages/admin/Agents";
import AdminCommunes from "./pages/admin/Communes";
import AdminCenters from "./pages/admin/Centers";
import AdminServices from "./pages/admin/Services";
import AdminRequests from "./pages/admin/Requests";
import AdminAudit from "./pages/admin/Audit";
import AdminSettings from "./pages/admin/Settings";

// 1. DÉFINIR NAVS EN PREMIER (avant les composants qui l'utilisent)
const NAVS = {
  citizen: [
    { to: "", end: true, label: "Dashboard", icon: LayoutDashboard },
    { to: "nouvelle-demande", label: "Nouvelle demande", icon: FilePlus },
    { to: "demandes", label: "Mes demandes", icon: FileText },
    { to: "notifications", label: "Notifications", icon: Bell },
    { to: "profil", label: "Profil", icon: User },
    { to: "parametres", label: "Paramètres", icon: Settings },
  ],
  agent: [
    { to: "", end: true, label: "Dashboard", icon: LayoutDashboard },
    { to: "demandes", label: "Demandes", icon: FileText },
    { to: "notifications", label: "Notifications", icon: Bell },
    { to: "profil", label: "Profil", icon: User },
  ],
  admin: [
    { to: "", end: true, label: "Dashboard", icon: LayoutDashboard },
    { to: "utilisateurs", label: "Utilisateurs", icon: Users },
    { to: "agents", label: "Agents", icon: UserCog },
    { to: "communes", label: "Communes", icon: Building2 },
    { to: "centres", label: "Centres", icon: Landmark },
    { to: "services", label: "Services", icon: Layers },
    { to: "demandes", label: "Demandes", icon: FileText },
    { to: "audit", label: "Audit", icon: ShieldCheck },
    { to: "parametres", label: "Paramètres", icon: Settings },
  ]
};

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <PublicHeader />
    <div className="flex-1"><Outlet /></div>
    <PublicFooter />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          {/* Espace Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          {/* Espace Citoyen (rôle CITIZEN retourné par le backend) */}
          <Route element={<ProtectedRoute allowedRoles={["CITIZEN"]} />}>
            <Route path="/citoyen" element={<DashboardLayout basePath="/citoyen" items={NAVS.citizen} roleLabel="Espace Citoyen" />}>
              <Route index element={<CitizenDashboard />} />
              <Route path="nouvelle-demande" element={<NewRequest />} />
              <Route path="demandes" element={<MyRequests />} />
              <Route path="demandes/:id" element={<RequestDetail />} />
              <Route path="notifications" element={<CitizenNotifications />} />
              <Route path="profil" element={<CitizenProfile />} />
              <Route path="parametres" element={<CitizenSettings />} />
            </Route>
          </Route>

          {/* Espace Agent */}
          <Route element={<ProtectedRoute allowedRoles={["AGENT"]} />}>
            <Route path="/agent" element={<DashboardLayout basePath="/agent" items={NAVS.agent} roleLabel="Espace Agent" />}>
              <Route index element={<AgentDashboard />} />
              <Route path="demandes" element={<AgentRequestList />} />
              <Route path="demandes/:id" element={<AgentRequestDetail />} />
              <Route path="notifications" element={<AgentNotifications />} />
              <Route path="profil" element={<AgentProfile />} />
            </Route>
          </Route>

          {/* Espace Admin */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<DashboardLayout basePath="/admin" items={NAVS.admin} roleLabel="Espace Admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="utilisateurs" element={<AdminUsers />} />
              <Route path="agents" element={<AdminAgents />} />
              <Route path="communes" element={<AdminCommunes />} />
              <Route path="centres" element={<AdminCenters />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="demandes" element={<AdminRequests />} />
              <Route path="audit" element={<AdminAudit />} />
              <Route path="parametres" element={<AdminSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}