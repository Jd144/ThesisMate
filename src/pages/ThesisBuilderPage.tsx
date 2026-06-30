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
  const keywordLine = input.keywords.join(", ") || "topic-specific keywords";
  const contents = [
    ["1.", "Introduction", "1-3"],
    ["2.", "Review of Literature", "4-8"],
    ["3.", "Objectives of the Study", "9"],
    ["4.", "Materials and Methods", "10-14"],
    ["5.", "Results", "15-19"],
    ["6.", "Discussion", "20-22"],
    ["7.", "Conclusion", "23"],
    ["8.", "Future Aspects", "24"],
    ["9.", "References", "25-27"]
  ];
  const baseSections = [
    input.title,
    "Dissertation / Project Report",
    "Submitted in partial fulfilment of the academic requirement",
    `Subject / Domain: ${input.domain}`,
    "Submitted by",
    "[Student Name]",
    "[Enrollment / Roll Number]",
    "Under the supervision of",
    "[Supervisor Name]",
    "[Department / School / University Name]",
    `Requested format: ${input.format}`,
    "",
    "CERTIFICATE",
    `This is to certify that [Student Name] has completed the project titled "${input.title}" under the guidance of [Supervisor Name]. The work has been prepared for academic review in the field of ${input.domain}. The final submission should be verified by the institution, supervisor, and student before official use.`,
    "",
    "Signature of Supervisor",
    "[Supervisor Name]",
    "[Designation]",
    "",
    "Signature of HOD / Coordinator",
    "[Name]",
    "[Department]",
    "",
    "DECLARATION",
    `I, [Student Name], declare that I have completed the project titled "${input.title}" under academic guidance. The information included in this report is prepared from the user-provided topic, outline, and requirements. All factual claims, references, and datasets must be verified before final submission.`,
    "",
    "[Student Name]",
    "[Enrollment / Roll Number]",
    "[Department / University]",
    "",
    "ACKNOWLEDGEMENT",
    `I would like to express sincere gratitude to my supervisor, department, faculty members, and all individuals who supported the completion of this report. The topic "${input.title}" helped develop a deeper understanding of ${input.domain}. I also acknowledge the importance of careful review, source verification, and ethical academic writing before final submission.`,
    "",
    "CONTENTS",
    "S.No.    Topic                                      Page No.",
    ...contents.map(([no, topic, pages]) => `${no.padEnd(8)}${topic.padEnd(43)}${pages}`),
    "",
    "ABBREVIATIONS",
    "AI      Artificial Intelligence",
    "APA     American Psychological Association",
    "DOCX    Microsoft Word Document",
    "PDF     Portable Document Format",
    "MOA     Mode / Method of Analysis",
    "",
    "LIST OF FIGURES",
    `Figure 1: Proposed workflow for ${input.title}`,
    "Figure 2: Conceptual framework based on user-provided visual instructions",
    "",
    "LIST OF TABLES",
    "Table 1: Suggested evidence map for report sections",
    "Table 2: Summary of expected findings and user verification requirements",
    "",
    "ABSTRACT",
    `This paper examines ${input.title} within the field of ${input.domain}. The central focus is ${input.description.toLowerCase()} The paper is structured to present background, literature context, a practical methodology, discussion, and conclusion. The draft uses user-provided requirements and includes placeholders for tables, diagrams, and flowcharts where visual evidence should be inserted.`,
    "",
    "1. INTRODUCTION",
    `Academic work in ${input.domain} increasingly requires structured planning, transparent reasoning, and careful revision. ${input.description} This paper introduces the topic, explains its relevance, and frames the discussion around ${keywordLine}. The purpose is to provide a coherent draft that can be reviewed, cited, and edited by the user before final submission.`,
    `The topic is important because it connects academic writing, evidence development, and structured presentation. A report in this format should begin with a clear problem background, then gradually move toward objectives, methodology, results, and interpretation. The final document should maintain consistent headings, page numbers, figure titles, table titles, and references.`,
    "",
    "2. REVIEW OF LITERATURE",
    `Existing academic discussions often connect this topic with productivity, writing quality, research support, and ethical use. A complete final paper should replace these placeholders with verified sources. [Citation needed: recent study on ${input.domain}] [Citation needed: institutional writing guidelines] The literature section should compare different viewpoints, identify gaps, and explain why the present paper is necessary.`,
    `The review should include definitions, major theories, previous research, limitations in existing work, and the need for the present study. Each paragraph should connect back to ${input.title}. The user should add real references from journals, books, reports, or institutional sources.`,
    "",
    "3. OBJECTIVES OF THE STUDY",
    "The major objectives of this study are:",
    `1. To examine the academic relevance of ${input.title}.`,
    `2. To analyse the key themes related to ${keywordLine}.`,
    "3. To prepare a structured report that can be edited, checked, and formatted before submission.",
    "4. To identify areas where figures, tables, citations, and real evidence must be added.",
    "",
    "4. MATERIALS AND METHODS",
    `The methodology can be developed as a descriptive or analytical study depending on the user's final requirement. A suitable approach may include document review, survey responses, interview notes, or comparative analysis. The user should add real sample details, instruments, and limitations. ${input.visualNotes}`,
    "The methodology section should clearly describe research design, data sources, inclusion criteria, tools used, and ethical considerations. If the report is experimental, exact materials, instruments, and procedures must be listed. If the report is conceptual or review-based, search strategy and source selection should be mentioned.",
    "",
    "Figure 1: Proposed workflow",
    "Topic selection -> Outline approval -> Section drafting -> Human editing -> Similarity review -> Final export",
    "",
    "Figure 2: Conceptual framework",
    input.visualNotes,
    "",
    "Table 1: Suggested evidence map",
    "Section | Evidence needed | User action",
    "Introduction | Background data | Add verified source",
    "Literature Review | Prior studies | Add citations",
    "Methodology | Process details | Add real sample/method",
    "Findings | Observations | Add collected data",
    "",
    "5. RESULTS",
    `The findings should be organized around the main themes from the user's input. Since no real dataset has been uploaded in this demo, this draft avoids inventing fake statistics. The discussion should explain patterns, compare them with cited research, and connect them to the objective. Any claim about performance, accuracy, student outcomes, or institutional acceptance must be supported with real evidence.`,
    "",
    "Table 2: Summary of expected findings and verification needs",
    "Theme | Expected observation | Verification required",
    `${input.domain} relevance | Topic is academically relevant | Add cited support`,
    "Writing workflow | Structure improves clarity | Add source or user data",
    "Visual material | Figures and tables improve explanation | Insert final visuals",
    "",
    "6. DISCUSSION",
    `The discussion interprets the expected findings in relation to ${input.title}. It should explain why the topic matters, how the observations compare with earlier studies, and what practical or academic implications may arise. Any generated statement should be checked against real sources before publication.`,
    "",
    "7. CONCLUSION",
    `The paper concludes that ${input.title} is a relevant topic for ${input.domain}, especially when the writing process is transparent and reviewed by the user. The final version should include verified citations, real data where required, and careful editing for clarity, originality, and academic tone.`,
    "",
    "8. FUTURE ASPECTS",
    "Future work may include adding verified datasets, expanding the literature review, improving the visual framework, and validating the conclusions through expert review or empirical analysis.",
    "",
    "9. REFERENCES",
    "1. [Add verified reference in requested style]",
    "2. [Add verified reference in requested style]",
    "3. [Add verified reference in requested style]",
    "",
    "QUALITY REVIEW NOTE",
    "This draft is designed to reduce formatting effort and support academic writing. It cannot honestly guarantee 100% plagiarism-free or 100% AI-detection-free status. The user must verify sources, add real citations, review similarity, and complete human editing before submission."
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
