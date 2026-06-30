import { Link } from "react-router-dom";
import { ArrowRight, FileDown, History, PenLine, SearchCheck, Workflow } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { StatGrid } from "../components/StatGrid";
import { sampleProjects } from "../data/mockData";
import { planLabel, useAppState } from "../lib/appState";

export function Dashboard() {
  const { plan, freeChecksLeft, projectsCreated, exportsCreated, user } = useAppState();
  const usageMetrics = [
    { label: "Free checks left", value: plan === "FREE" ? String(freeChecksLeft) : "Unlimited" },
    { label: "Current plan", value: planLabel(plan) },
    { label: "Projects", value: String(projectsCreated) },
    { label: "Exports", value: String(exportsCreated) }
  ];

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">{user ? `Welcome ${user.name}` : "Demo workspace"}</p>
          <h2>{plan === "FREE" ? "Free account: checks work now, paper writing is locked." : `${planLabel(plan)} plan active: writing tools are unlocked.`}</h2>
          <p>
            Free plan users can run 2 similarity or spell checks per month. Paid users can create papers from title,
            description, outline choice, format rules, and figure or flowchart instructions.
          </p>
          <div className="button-row">
            <Link className="primary-action" to="/app/similarity">
              Run free check <ArrowRight size={16} />
            </Link>
            <Link className="secondary-action" to="/pricing">
              Choose paid plan
            </Link>
          </div>
        </div>
      </section>

      <StatGrid stats={usageMetrics} />

      <div className="feature-grid">
        {[
          { icon: SearchCheck, title: "Free checks", text: "2 monthly similarity/spell checks before upgrading." },
          { icon: Workflow, title: "Paid paper builder", text: plan === "FREE" ? "Choose AI Tool, Combo, or Premium to unlock this." : "Unlocked: generate outline first, then section by section." },
          { icon: PenLine, title: "Prompt editing", text: "User can edit manually or ask AI to rewrite, expand, format, or cite." },
          { icon: FileDown, title: "Export system", text: "Premium users can download PDF, DOCX, Markdown, and HTML." }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article className="feature-card" key={item.title}>
              <Icon size={22} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>

      <SectionCard title="Recent projects" description="Paid writing projects will appear here after the user creates them.">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Chapters</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {sampleProjects.map((project) => (
                <tr key={project.title}>
                  <td>{project.title}</td>
                  <td>{project.chapters}</td>
                  <td>{project.status}</td>
                  <td>{project.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
