import { Clock, Plus, Save } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { sampleProjects } from "../data/mockData";

export function ProjectsPage() {
  return (
    <div className="page-grid">
      <SectionCard title="Projects" description="Create projects, save chapters, and restore previous versions.">
        <div className="button-row">
          <button className="primary-action"><Plus size={16} /> New project</button>
          <button className="secondary-action"><Save size={16} /> Save chapter</button>
        </div>
        <div className="project-grid">
          {sampleProjects.map((project) => (
            <article className="project-card" key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.chapters} chapters · {project.status}</p>
              <span><Clock size={15} /> Updated {project.updated}</span>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Version history" description="Each autosave can store a lightweight snapshot for rollback.">
        <div className="timeline">
          {["Initial outline created", "Chapter 1 revised", "Similarity review completed", "Export draft generated"].map((item, index) => (
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
