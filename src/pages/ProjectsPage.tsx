import { Clock, Plus, Save } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { sampleProjects } from "../data/mockData";

export function ProjectsPage() {
  const latestTitle = localStorage.getItem("thesismate-last-paper-title");

  return (
    <div className="page-grid">
      <SectionCard title="Projects" description="Generated papers are saved here. User can reopen and edit later.">
        <div className="button-row">
          <button className="primary-action" onClick={() => { window.location.href = "/app/builder"; }}><Plus size={16} /> New paper</button>
          <button className="secondary-action" onClick={() => { window.location.href = "/app/editor"; }}><Save size={16} /> Open saved draft</button>
        </div>
        <div className="project-grid">
          {latestTitle ? (
            <article className="project-card">
              <h3>{latestTitle}</h3>
              <p>Generated paper - Ready for editing</p>
              <span><Clock size={15} /> Saved just now</span>
              <button className="secondary-action" onClick={() => { window.location.href = "/app/editor"; }}>Edit paper</button>
            </article>
          ) : null}
          {sampleProjects.map((project) => (
            <article className="project-card" key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.chapters} chapters - {project.status}</p>
              <span><Clock size={15} /> Updated {project.updated}</span>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Version history" description="Generated drafts and edits can be restored from here.">
        <div className="timeline">
          {["Input completed", "Outline approved", "Full paper generated", "Ready for editing"].map((item, index) => (
            <div className="timeline-item" key={item}>
              <strong>v{index + 1}</strong>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
