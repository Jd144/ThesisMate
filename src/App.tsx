import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
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
import { HomePage } from "./pages/HomePage";
import { PricingPage } from "./pages/PricingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SimilarityPage } from "./pages/SimilarityPage";
import { ThesisBuilderPage } from "./pages/ThesisBuilderPage";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/builder", label: "Paper Builder", icon: BookOpen },
  { to: "/app/editor", label: "Smart Editor", icon: FileText },
  { to: "/app/projects", label: "Projects", icon: ClipboardCheck },
  { to: "/app/similarity", label: "Similarity", icon: BarChart3 },
  { to: "/pricing", label: "Plans", icon: CreditCard },
  { to: "/app/profile", label: "Account", icon: UserRound },
  { to: "/app/admin", label: "Master Admin", icon: Shield }
];

export default function App() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMarketing = ["/", "/auth", "/pricing"].includes(location.pathname);

  if (isMarketing) {
    return (
      <div className="marketing-shell">
        <header className="marketing-topbar">
          <Link to="/" className="brand">
            <span className="brand-mark">TM</span>
            <span>
              <strong>ThesisMate</strong>
              <small>AI academic writing platform</small>
            </span>
          </Link>
          <nav>
            <Link to="/pricing">Plans</Link>
            <Link to="/auth">Login</Link>
            <Link className="primary-action" to="/auth">Sign up</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand-row">
          <Link to="/app" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">TM</span>
            <span>
              <strong>ThesisMate</strong>
              <small>Student workspace</small>
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
          <span>Free plan: 2 checks/month. Paper writing needs a paid plan.</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button className="icon-btn mobile-only" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div>
            <p className="eyebrow">Logged in workspace</p>
            <h1>Plan-based academic writing tools</h1>
          </div>
          <Link className="primary-action" to="/pricing">
            Upgrade plan
          </Link>
        </header>
        <Routes>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/builder" element={<ThesisBuilderPage />} />
          <Route path="/app/editor" element={<EditorPage />} />
          <Route path="/app/projects" element={<ProjectsPage />} />
          <Route path="/app/similarity" element={<SimilarityPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/app/profile" element={<ProfilePage />} />
          <Route path="/app/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}
