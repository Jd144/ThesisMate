import { Link } from "react-router-dom";
import { ArrowRight, FileDown, History, PenLine, Workflow } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { StatGrid } from "../components/StatGrid";
import { sampleProjects, usageMetrics } from "../data/mockData";

export function Dashboard() {
  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">New academic workflow</p>
          <h2>Build thesis chapters in controlled steps, edit drafts, track versions, and export clean files.</h2>
          <p>
            ThesisMate now focuses on structured academic writing. The system guides users from topic to outline to
            small editable draft chunks, without making unsafe originality claims.
          </p>
          <div className="button-row">
            <Link className="primary-action" to="/builder">
              Start builder <ArrowRight size={16} />
            </Link>
            <Link className="secondary-action" to="/editor">
              Open editor
            </Link>
          </div>
        </div>
      </section>

      <StatGrid stats={usageMetrics} />

      <div className="feature-grid">
        {[
          { icon: Workflow, title: "Stepwise thesis builder", text: "Structure, chapter outlines, and small section drafts." },
          { icon: PenLine, title: "Smart editor", text: "Rich editing, AI sidebar actions, tables, figures, and flowchart placeholders." },
          { icon: History, title: "Project history", text: "Autosave-ready data model with version snapshots." },
          { icon: FileDown, title: "Export system", text: "Backend routes prepared for PDF, DOCX, Markdown, and HTML exports." }
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

      <SectionCard title="Recent projects" description="Saved academic workspaces with live status.">
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
