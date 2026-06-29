import { useMemo, useState } from "react";
import { Wand2 } from "lucide-react";
import { SectionCard } from "../components/SectionCard";

const steps = ["Input", "Structure", "Chapter outlines", "Section drafts", "Review"];

export function ThesisBuilderPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [topic, setTopic] = useState("Impact of AI tools on postgraduate academic writing");
  const [domain, setDomain] = useState("Education Technology");
  const [objective, setObjective] = useState("Study how AI writing assistants affect planning, editing, and academic confidence.");
  const [keywords, setKeywords] = useState("AI writing, thesis support, academic workflow, postgraduate students");

  const generated = useMemo(() => {
    const keywordList = keywords.split(",").map((item) => item.trim()).filter(Boolean);
    return {
      structure: ["Abstract", "Introduction", "Literature Review", "Methodology", "Analysis", "Discussion", "Conclusion"],
      outlines: [
        "Introduction: background, problem statement, objectives, research questions.",
        `Literature Review: compare prior studies in ${domain} and define key concepts.`,
        "Methodology: research design, sample, instruments, limitations, ethics.",
        "Analysis: organize findings around themes and evidence.",
        "Discussion: connect findings to objective and academic sources."
      ],
      draft:
        `This section draft is intentionally small. The study examines "${topic}" within ${domain}. ` +
        `It focuses on ${objective.toLowerCase()} Key terms include ${keywordList.slice(0, 3).join(", ")}.`
    };
  }, [domain, keywords, objective, topic]);

  return (
    <div className="page-grid">
      <SectionCard
        title="Smart Thesis Builder"
        description="Generate structure first, then outlines, then small editable draft chunks."
        action={<span className="badge">Human review required</span>}
      >
        <div className="stepper">
          {steps.map((step, index) => (
            <button className={activeStep === index ? "active" : ""} key={step} onClick={() => setActiveStep(index)}>
              {index + 1}. {step}
            </button>
          ))}
        </div>

        {activeStep === 0 && (
          <form className="builder-form">
            <label>Topic<input value={topic} onChange={(event) => setTopic(event.target.value)} /></label>
            <label>Domain<input value={domain} onChange={(event) => setDomain(event.target.value)} /></label>
            <label>Objective<textarea value={objective} onChange={(event) => setObjective(event.target.value)} /></label>
            <label>Keywords<input value={keywords} onChange={(event) => setKeywords(event.target.value)} /></label>
            <label>Optional data file<input type="file" /></label>
            <label>Optional sample file<input type="file" /></label>
          </form>
        )}

        {activeStep === 1 && <EditableList title="Generated thesis structure" items={generated.structure} />}
        {activeStep === 2 && <EditableList title="Generated chapter outlines" items={generated.outlines} />}
        {activeStep === 3 && (
          <div className="draft-box" contentEditable suppressContentEditableWarning>
            {generated.draft}
          </div>
        )}
        {activeStep === 4 && (
          <div className="review-box">
            <Wand2 size={22} />
            <h3>Ready for editor</h3>
            <p>Save this project, continue editing chapter by chapter, or export after final human review.</p>
          </div>
        )}

        <div className="button-row">
          <button className="secondary-action" disabled={activeStep === 0} onClick={() => setActiveStep((step) => step - 1)}>
            Back
          </button>
          <button className="primary-action" disabled={activeStep === steps.length - 1} onClick={() => setActiveStep((step) => step + 1)}>
            Continue
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function EditableList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="editable-list">
      <h3>{title}</h3>
      {items.map((item, index) => (
        <div className="editable-line" contentEditable suppressContentEditableWarning key={`${item}-${index}`}>
          {item}
        </div>
      ))}
    </div>
  );
}
