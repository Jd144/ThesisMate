import { useMemo, useState } from "react";
import { CheckCircle2, Lock, Wand2 } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { isWritingPlan, planLabel, useAppState } from "../lib/appState";

const steps = ["Access", "Paper input", "Outline", "Section writing", "Full paper"];

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
    const structure = outlineMode === "user"
      ? userOutline.split(/\r?\n/).filter(Boolean)
      : ["Title Page", "Abstract", "Introduction", "Literature Review", "Methodology", "Findings", "Discussion", "Conclusion", "References"];
    const outlines = [
      "Abstract: research purpose, method, key findings, and contribution.",
      "Introduction: background, problem statement, objectives, research questions.",
      `Literature Review: compare prior studies in ${domain} and define key concepts.`,
      "Methodology: research design, sample, instruments, limitations, ethics.",
      `Visual placement: ${visualNotes}`,
      `Formatting rules: ${format}`
    ];

    const draft =
      `Draft chunk for "${title}"\n\nThis section discusses ${description.toLowerCase()} ` +
      `The writing should follow ${format}. Key terms include ${keywordList.slice(0, 3).join(", ")}.\n\n` +
      `[Insert Figure 1 here: ${visualNotes}]`;

    return {
      structure,
      outlines,
      draft,
      fullPaper: buildFullPaper({ title, domain, description, keywords: keywordList, format, visualNotes, structure })
    };
  }, [description, domain, format, keywords, outlineMode, title, userOutline, visualNotes]);

  function saveGeneratedPaper(openEditor: boolean) {
    localStorage.setItem("thesismate-last-paper-title", title);
    localStorage.setItem("thesismate-last-paper", generated.fullPaper);
    saveProject();
    window.location.href = openEditor ? "/app/editor" : "/app/projects";
  }

  return (
    <div className="page-grid">
      <SectionCard
        title="Paper / Thesis Builder"
        description="Input ke baad outline approve hota hai, section writing banti hai, phir final step me full paper milta hai."
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
            <h3>{isPaid ? "Paper writing is unlocked" : "Paper writing is locked on this plan"}</h3>
            <p>
              Free users can use similarity/spell checks only. AI Tool, Combo, or Premium unlocks paper writing.
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
            <label>Required format and word count<input value={format} onChange={(event) => setFormat(event.target.value)} /></label>
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
          <div className="final-paper-layout">
            <div className="review-box">
              <Wand2 size={22} />
              <h3>Full paper generated</h3>
              <p>Generated from your title, description, format, outline, and visual instructions. Review before publishing.</p>
              <div className="quality-grid">
                {["Similarity risk review", "AI-like pattern review", "Citation placeholders", "Human edit required"].map((item) => (
                  <span key={item}><CheckCircle2 size={16} /> {item}</span>
                ))}
              </div>
              <p className="form-message">
                Important: No platform can honestly guarantee 100% plagiarism-free or AI-detection-free output. This tool helps reduce risk and prepare a cleaner draft for human review.
              </p>
            </div>
            <textarea className="document-editor" value={generated.fullPaper} readOnly />
            <div className="button-row">
              <button className="primary-action" onClick={() => saveGeneratedPaper(true)}>Save and edit paper</button>
              <button className="secondary-action" onClick={() => saveGeneratedPaper(false)}>Save to project history</button>
            </div>
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

function buildFullPaper(input: {
  title: string;
  domain: string;
  description: string;
  keywords: string[];
  format: string;
  visualNotes: string;
  structure: string[];
}) {
  const targetWords = getTargetWords(input.format);
  const baseSections = [
    `Title: ${input.title}`,
    `Format requested: ${input.format}`,
    "",
    "Abstract",
    `This paper examines ${input.title} within the field of ${input.domain}. The central focus is ${input.description.toLowerCase()} The paper is structured to present background, literature context, a practical methodology, discussion, and conclusion. The draft uses user-provided requirements and includes placeholders for tables, diagrams, and flowcharts where visual evidence should be inserted.`,
    "",
    "Introduction",
    `Academic work in ${input.domain} increasingly requires structured planning, transparent reasoning, and careful revision. ${input.description} This paper introduces the topic, explains its relevance, and frames the discussion around ${input.keywords.join(", ") || "the provided keywords"}. The purpose is to provide a coherent draft that can be reviewed, cited, and edited by the user before final submission.`,
    "",
    "Literature Review",
    `Existing academic discussions often connect this topic with productivity, writing quality, research support, and ethical use. A complete final paper should replace these placeholders with verified sources. [Citation needed: recent study on ${input.domain}] [Citation needed: institutional writing guidelines] The literature section should compare different viewpoints, identify gaps, and explain why the present paper is necessary.`,
    "",
    "Methodology",
    `The methodology can be developed as a descriptive or analytical study depending on the user's final requirement. A suitable approach may include document review, survey responses, interview notes, or comparative analysis. The user should add real sample details, instruments, and limitations. ${input.visualNotes}`,
    "",
    "Figure 1: Proposed workflow",
    "Topic selection -> Outline approval -> Section drafting -> Human editing -> Similarity review -> Final export",
    "",
    "Table 1: Suggested evidence map",
    "Section | Evidence needed | User action",
    "Introduction | Background data | Add verified source",
    "Literature Review | Prior studies | Add citations",
    "Methodology | Process details | Add real sample/method",
    "Findings | Observations | Add collected data",
    "",
    "Findings and Discussion",
    `The findings should be organized around the main themes from the user's input. Since no real dataset has been uploaded in this demo, this draft avoids inventing fake statistics. The discussion should explain patterns, compare them with cited research, and connect them to the objective. Any claim about performance, accuracy, student outcomes, or institutional acceptance must be supported with real evidence.`,
    "",
    "Conclusion",
    `The paper concludes that ${input.title} is a relevant topic for ${input.domain}, especially when the writing process is transparent and reviewed by the user. The final version should include verified citations, real data where required, and careful editing for clarity, originality, and academic tone.`,
    "",
    "References",
    "[Add verified references here in the requested format.]"
  ];

  const expansion = [
    `The argument should remain specific to ${input.domain} and avoid broad unsupported claims.`,
    "Each paragraph should include a clear topic sentence, supporting explanation, and a connection back to the research objective.",
    "Where evidence is missing, the paper should use a citation placeholder instead of inventing data.",
    "The user should review wording, add institution-approved references, and confirm formatting before submission."
  ];

  const words = baseSections.join(" ").split(/\s+/).filter(Boolean).length;
  const output = [...baseSections];
  let currentWords = words;
  let index = 0;
  while (currentWords < targetWords) {
    const paragraph = expansion[index % expansion.length];
    output.splice(Math.max(output.length - 3, 0), 0, paragraph);
    currentWords += paragraph.split(/\s+/).length;
    index += 1;
  }

  return output.join("\n");
}

function getTargetWords(format: string) {
  const match = format.match(/(\d{3,5})\s*(words?|word)/i);
  if (!match) return 1200;
  return Math.min(Math.max(Number(match[1]), 500), 6000);
}
