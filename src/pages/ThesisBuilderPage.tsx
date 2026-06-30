import { useMemo, useState } from "react";
import { Lock, Wand2 } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { isWritingPlan, planLabel, useAppState } from "../lib/appState";

const steps = ["Access", "Paper input", "Outline", "Section writing", "Editor handoff"];

export function ThesisBuilderPage() {
  const { plan, saveProject } = useAppState();
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState("Impact of AI tools on postgraduate academic writing");
  const [domain, setDomain] = useState("Education Technology");
  const [description, setDescription] = useState("Study how AI writing assistants affect planning, editing, and academic confidence.");
  const [keywords, setKeywords] = useState("AI writing, thesis support, academic workflow, postgraduate students");
  const [outlineMode, setOutlineMode] = useState<"ai" | "user">("ai");
  const [userOutline, setUserOutline] = useState("1. Introduction\n2. Literature Review\n3. Methodology\n4. Findings\n5. Conclusion");
  const [format, setFormat] = useState("APA style, 2500 words, formal academic tone");
  const [visualNotes, setVisualNotes] = useState("Add Figure 1 after methodology: flowchart of research process. Add Table 1 in literature review.");
  const isPaid = isWritingPlan(plan);

  const generated = useMemo(() => {
    const keywordList = keywords.split(",").map((item) => item.trim()).filter(Boolean);
    return {
      structure: outlineMode === "user"
        ? userOutline.split(/\r?\n/).filter(Boolean)
        : ["Title Page", "Abstract", "Introduction", "Literature Review", "Methodology", "Findings", "Discussion", "Conclusion", "References"],
      outlines: [
        "Abstract: research purpose, method, key findings, and contribution.",
        "Introduction: background, problem statement, objectives, research questions.",
        `Literature Review: compare prior studies in ${domain} and define key concepts.`,
        "Methodology: research design, sample, instruments, limitations, ethics.",
        `Visual placement: ${visualNotes}`,
        `Formatting rules: ${format}`
      ],
      draft:
        `Draft chunk for "${title}"\n\nThis section discusses ${description.toLowerCase()} ` +
        `The writing should follow ${format}. Key terms include ${keywordList.slice(0, 3).join(", ")}.\n\n` +
        `[Insert Figure 1 here: ${visualNotes}]`
    };
  }, [description, domain, format, keywords, outlineMode, title, userOutline, visualNotes]);

  return (
    <div className="page-grid">
      <SectionCard
        title="Paper / Thesis Builder"
        description="Paid feature: title and instructions go in, outline approval comes first, then section-wise writing."
        action={<span className={isPaid ? "badge success" : "badge"}>{isPaid ? `${planLabel(plan)} active` : "Paid plan required"}</span>}
      >
        <div className="stepper">
          {steps.map((step, index) => (
            <button className={activeStep === index ? "active" : ""} key={step} onClick={() => setActiveStep(index)}>
              {index + 1}. {step}
            </button>
          ))}
        </div>

        {activeStep === 0 && (
          <div className="locked-feature">
            <Lock size={24} />
            <h3>Paper writing is locked on Free plan</h3>
            <p>
              Free users can use 2 monthly similarity/spell checks only. AI Tool, Combo, or Premium unlocks paper writing.
            </p>
            <span className={isPaid ? "badge success" : "badge"}>{isPaid ? "Unlocked" : `Current plan: ${planLabel(plan)}`}</span>
            {!isPaid ? <button className="primary-action" onClick={() => { window.location.href = "/pricing"; }}>Choose paid plan</button> : null}
          </div>
        )}

        {activeStep === 1 && (
          <form className="builder-form">
            <label>Paper title<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
            <label>Domain<input value={domain} onChange={(event) => setDomain(event.target.value)} /></label>
            <label>Paper description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
            <label>Keywords<input value={keywords} onChange={(event) => setKeywords(event.target.value)} /></label>
            <label>Required format<input value={format} onChange={(event) => setFormat(event.target.value)} /></label>
            <label>
              Outline choice
              <select value={outlineMode} onChange={(event) => setOutlineMode(event.target.value as "ai" | "user")}>
                <option value="ai">Platform creates outline</option>
                <option value="user">User provides outline</option>
              </select>
            </label>
            {outlineMode === "user" ? (
              <label>User outline<textarea value={userOutline} onChange={(event) => setUserOutline(event.target.value)} /></label>
            ) : null}
            <label>Figures / flowcharts / tables placement notes<textarea value={visualNotes} onChange={(event) => setVisualNotes(event.target.value)} /></label>
            <label>Optional reference file<input type="file" /></label>
            <label>Optional sample paper<input type="file" /></label>
          </form>
        )}

        {activeStep === 2 && <EditableList title="Outline for approval" items={generated.structure.concat(generated.outlines)} />}
        {activeStep === 3 && (
          <div className="draft-box" contentEditable suppressContentEditableWarning>
            {generated.draft}
          </div>
        )}
        {activeStep === 4 && (
          <div className="review-box">
            <Wand2 size={22} />
            <h3>Ready for Smart Editor</h3>
            <p>After the paper is generated, users can edit manually or give prompts for rewrite, format, citation, and expansion.</p>
            <button className="primary-action" onClick={() => { saveProject(); window.location.href = "/app/editor"; }}>Save project and open editor</button>
          </div>
        )}

        <div className="button-row">
          <button className="secondary-action" disabled={activeStep === 0} onClick={() => setActiveStep((step) => step - 1)}>
            Back
          </button>
          <button className="primary-action" disabled={activeStep === steps.length - 1 || (!isPaid && activeStep === 0)} onClick={() => setActiveStep((step) => step + 1)}>
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
