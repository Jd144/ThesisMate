import { Link, NavLink, Route, Routes } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  Lock,
  Menu,
  Shield,
  UserRound,
  X
} from "lucide-react";
import { useState } from "react";
import { AdminPanel } from "./pages/AdminPanel";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { EditorPage } from "./pages/EditorPage";
import { PricingPage } from "./pages/PricingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SimilarityPage } from "./pages/SimilarityPage";
import { ThesisBuilderPage } from "./pages/ThesisBuilderPage";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/builder", label: "Thesis Builder", icon: BookOpen },
  { to: "/editor", label: "Smart Editor", icon: FileText },
  { to: "/projects", label: "Projects", icon: ClipboardCheck },
  { to: "/similarity", label: "Similarity", icon: BarChart3 },
  { to: "/pricing", label: "Pricing", icon: CreditCard },
  { to: "/profile", label: "Account", icon: UserRound },
  { to: "/admin", label: "Admin", icon: Shield }
];

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand-row">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">TM</span>
            <span>
              <strong>ThesisMate</strong>
              <small>Academic workspace</small>
            </span>
          </Link>
          <button className="icon-btn mobile-only" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="nav-list">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="security-note">
          <Lock size={16} />
          <span>Secure drafts, account controls, and usage tracking are built into the platform.</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button className="icon-btn mobile-only" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div>
            <p className="eyebrow">Professional thesis/report assistant</p>
            <h1>AI-assisted writing with human editing at every step</h1>
          </div>
          <Link className="primary-action" to="/auth">
            Login
          </Link>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/builder" element={<ThesisBuilderPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/similarity" element={<SimilarityPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}
