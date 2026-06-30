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
  const [outputType, setOutputType] = useState<"report" | "research">("research");
  const [format, setFormat] = useState("Research paper style, 2500 words, formal academic tone");
  const [visualNotes, setVisualNotes] = useState("Add Figure 1 after methodology: flowchart of research process. Add Table 1 in literature review.");
  const [customPrompt, setCustomPrompt] = useState("Write like a biomedical materials research article. Include abstract, keywords, introduction, materials and methods, results and discussion, conclusion, figures, tables, and references. Keep diagrams and tables clean.");
  const isPaid = isWritingPlan(plan);

  const generated = useMemo(() => {
    const keywordList = keywords.split(",").map((item) => item.trim()).filter(Boolean);
    const structure = outlineMode === "user"
      ? userOutline.split(/\r?\n/).filter(Boolean)
      : outputType === "research"
        ? ["Title and authors", "Article info", "Abstract", "Keywords", "Introduction", "Materials and Methods", "Results", "Discussion", "Conclusion", "References"]
        : ["Title Page", "Abstract", "Introduction", "Literature Review", "Methodology", "Findings", "Discussion", "Conclusion", "References"];
    const outlines = outputType === "research"
      ? [
          "Abstract: journal-style summary with aim, method, result direction, and conclusion.",
          "Introduction: problem background, literature gap, and study objective.",
          "Materials and Methods: study design, materials/data, characterization, evaluation workflow.",
          "Results: structured findings with figure and table placement.",
          "Discussion: compare with literature and explain mechanism/importance.",
          `Custom prompt applied: ${customPrompt}`,
          `Visual placement: ${visualNotes}`
        ]
      : [
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
      fullPaper: buildFullPaper({ title, domain, description, keywords: keywordList, format, visualNotes, customPrompt, outputType, structure })
    };
  }, [customPrompt, description, domain, format, keywords, outlineMode, outputType, title, userOutline, visualNotes]);

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
            <label>
              Output type
              <select value={outputType} onChange={(event) => setOutputType(event.target.value as "report" | "research")}>
                <option value="research">Research paper / journal article</option>
                <option value="report">Dissertation / project report</option>
              </select>
            </label>
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
            <label>Custom prompt / extra instructions<textarea value={customPrompt} onChange={(event) => setCustomPrompt(event.target.value)} placeholder="Hindi, English, or any language me likho: kaise paper banana hai, table/diagram kya chahiye, tone, format, etc." /></label>
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
  customPrompt: string;
  outputType: "report" | "research";
  structure: string[];
}) {
  const targetWords = getTargetWords(input.format);
  const keywordLine = input.keywords.join(", ") || "topic-specific keywords";
  if (input.outputType === "research" || /research paper|journal|article|manuscript/i.test(input.format + " " + input.customPrompt)) {
    return buildResearchPaper(input, targetWords, keywordLine);
  }
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
    `User prompt: ${input.customPrompt}`,
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

  return completeWithUniqueParagraphs(baseSections, targetWords, input, keywordLine, "report").join("\n");
}

function buildResearchPaper(input: {
  title: string;
  domain: string;
  description: string;
  keywords: string[];
  format: string;
  visualNotes: string;
  customPrompt: string;
  structure: string[];
}, targetWords: number, keywordLine: string) {
  const sections = [
    input.title,
    "[Author Name]1, [Co-author Name]2, [Supervisor Name]1,*",
    "1 Department / School / Institute Name",
    "2 Collaborating Department / Institute Name",
    "* Corresponding author: [email@example.com]",
    "",
    "ARTICLE INFO",
    "Received: [Date] | Revised: [Date] | Accepted: [Date]",
    `Keywords: ${keywordLine}`,
    "",
    "ABSTRACT",
    `This manuscript presents a structured study on ${input.title} in the domain of ${input.domain}. ${input.description} The work is organized in a research-article format similar to biomedical and materials-science journal papers, with abstract, keywords, introduction, methodology, results, discussion, conclusion, figures, tables, and references. The draft follows the user's custom instruction: ${input.customPrompt}`,
    "",
    "1. INTRODUCTION",
    `Research in ${input.domain} requires a clear connection between problem background, current limitations, and the proposed direction of study. ${input.title} is relevant because it connects ${keywordLine} with practical academic and scientific questions. The introduction should establish the need for the study, summarize current challenges, and identify the research gap without inventing unsupported claims.`,
    `Recent studies in related biomedical/materials research papers usually begin with a broad problem statement, then narrow toward a specific material, method, therapy, or mechanism. In the final version, this section should include verified citations from the reference PDFs and additional peer-reviewed sources.`,
    "",
    "2. MATERIALS AND METHODS",
    `This section should describe the study design, materials, synthesis or preparation method, characterization, experimental setup, and analysis workflow. If the user provides experimental values, they should be inserted here. If no real data is available, the report must keep method descriptions generic and mark data-dependent claims for verification.`,
    "2.1 Study design",
    `The study is designed to evaluate ${input.title} using a structured academic workflow. The research variables, sample conditions, treatment groups, and evaluation criteria should be defined based on real user data.`,
    "2.2 Materials / Dataset / Sources",
    "Materials, datasets, instruments, software, or literature sources should be listed with complete details. Add catalogue numbers, concentrations, sample size, inclusion criteria, or database search strings where applicable.",
    "2.3 Characterization / Evaluation",
    "Evaluation may include physical characterization, biological validation, statistical analysis, or literature-based comparison depending on the topic. The selected methods must match the user's domain and instructions.",
    "",
    "Figure 1: Schematic workflow of the study",
    "Problem identification -> Material / method selection -> Experimental or literature workflow -> Analysis -> Results interpretation -> Validation",
    "",
    "3. RESULTS",
    "The results section should present findings in a logical sequence. Since this demo cannot invent real experimental data, the table below marks where user-provided or verified results should be inserted.",
    "",
    "Table 1: Proposed result summary matrix",
    "Parameter | Observation to report | Evidence required",
    "Material / method property | Add measured value or qualitative result | Insert real data/source",
    "Biological or functional response | Add experimental observation | Insert image/table/citation",
    "Performance comparison | Compare with reference literature | Add verified reference",
    "Limitations | Mention observed constraints | Add user notes",
    "",
    "Figure 2: User-requested diagram / flowchart placement",
    input.visualNotes,
    "",
    "4. DISCUSSION",
    `The discussion should interpret the expected findings in relation to ${input.title}. It should compare the result trend with literature, explain possible mechanisms, and describe why the findings matter for ${input.domain}. Claims about efficiency, antibacterial activity, photothermal response, wound healing, biocompatibility, or clinical translation must be supported by verified evidence.`,
    "The discussion should also address limitations such as sample size, missing datasets, lack of in vivo validation, absence of long-term stability data, or incomplete citation support. This improves academic credibility and reduces the risk of unsupported conclusions.",
    "",
    "5. CONCLUSION",
    `The study indicates that ${input.title} can be developed into a structured academic manuscript when real data, verified citations, and final human editing are added. The generated draft provides a complete research-paper framework with sections, figures, tables, and reference placeholders.`,
    "",
    "6. FUTURE WORK",
    "Future work should include verified experiments, expanded references, statistical analysis, high-quality figures, and domain-specific validation based on the user's final research requirement.",
    "",
    "REFERENCES",
    "1. [Add verified reference from uploaded PDF/source in journal format]",
    "2. [Add verified reference from uploaded PDF/source in journal format]",
    "3. [Add verified reference from uploaded PDF/source in journal format]",
    "",
    "AUTHOR NOTE",
    "This generated manuscript is a formatted draft. It should be checked for similarity, AI-like patterns, citation accuracy, institutional formatting, and factual correctness before submission."
  ];

  return completeWithUniqueParagraphs(sections, targetWords, input, keywordLine, "research").join("\n");
}

function completeWithUniqueParagraphs(
  sections: string[],
  targetWords: number,
  input: {
    title: string;
    domain: string;
    description: string;
    keywords: string[];
    customPrompt: string;
    visualNotes: string;
  },
  keywordLine: string,
  kind: "report" | "research"
) {
  const output = [...sections];
  let currentWords = output.join(" ").split(/\s+/).filter(Boolean).length;
  const insertionIndex = findReferenceIndex(output);
  const paragraphs = createUniqueDevelopmentParagraphs(input, keywordLine, kind);
  let index = 0;

  while (currentWords < targetWords && index < paragraphs.length) {
    const paragraph = paragraphs[index];
    output.splice(insertionIndex + index, 0, paragraph);
    currentWords += paragraph.split(/\s+/).length;
    index += 1;
  }

  return output;
}

function findReferenceIndex(lines: string[]) {
  const index = lines.findIndex((line) => /^(9\.\s*)?REFERENCES$/i.test(line.trim()));
  return index >= 0 ? index : Math.max(lines.length - 2, 0);
}

function createUniqueDevelopmentParagraphs(
  input: {
    title: string;
    domain: string;
    description: string;
    keywords: string[];
    customPrompt: string;
    visualNotes: string;
  },
  keywordLine: string,
  kind: "report" | "research"
) {
  const keywords = input.keywords.length ? input.keywords : ["academic writing", "research design", "evidence review", "final editing"];
  const sectionAngles = kind === "research"
    ? [
        "Background and rationale",
        "Literature gap",
        "Study design",
        "Material or data selection",
        "Evaluation approach",
        "Result interpretation",
        "Comparative discussion",
        "Limitations and validation",
        "Figure and table placement",
        "Citation control"
      ]
    : [
        "Problem background",
        "Conceptual scope",
        "Review focus",
        "Objective alignment",
        "Method planning",
        "Evidence mapping",
        "Findings organization",
        "Discussion depth",
        "Visual explanation",
        "Final academic review"
      ];
  const evidenceNeeds = [
    "peer-reviewed citation",
    "user-provided dataset",
    "institutional guideline",
    "survey or interview note",
    "verified figure caption",
    "method description",
    "comparison table",
    "reference-paper example"
  ];
  const writingMoves = [
    "defines the central term before expanding the argument",
    "connects the paragraph back to the stated objective",
    "separates observation from interpretation",
    "marks claims that need citation instead of presenting them as final facts",
    "uses domain-specific wording without adding unsupported numbers",
    "keeps the tone formal while preserving readability",
    "places visual material close to the related explanation",
    "adds a transition that helps the reader follow the section"
  ];
  const contextSentences = [
    input.description,
    `The section should explain why ${keywordLine} matters for the selected topic.`,
    `The paragraph should move from general academic context toward the specific requirement of ${input.domain}.`,
    "The writing should avoid repeating the same sentence pattern and should introduce a new point in each paragraph.",
    "The draft should separate confirmed information, user-provided material, and citation placeholders.",
    "The section should make clear what evidence is still required before final submission.",
    "The explanation should be useful for a reader who has not seen the planning notes.",
    "The paragraph should support the next figure, table, method note, or discussion point."
  ];

  const paragraphs: string[] = [];
  for (let round = 0; round < 9; round += 1) {
    sectionAngles.forEach((angle, angleIndex) => {
      const keyword = keywords[(round + angleIndex) % keywords.length];
      const evidence = evidenceNeeds[(round + angleIndex) % evidenceNeeds.length];
      const move = writingMoves[(round * 2 + angleIndex) % writingMoves.length];
      const context = contextSentences[(round + angleIndex) % contextSentences.length];
      const promptNote = round % 6 === 0 && angleIndex < 2
        ? `The user instruction says: ${input.customPrompt}`
        : `The paragraph should remain aligned with the requested topic and format.`;
      const visualNote = round % 5 === 0 && angleIndex < 2
        ? `Visual planning note: ${input.visualNotes}`
        : "Any figure, table, or flowchart should be numbered and explained in the nearby text.";

      paragraphs.push(
        `${angle}: In relation to ${input.title}, the discussion of ${keyword} should be developed with a clear link to ${input.domain}. ${context} This part should use a ${evidence} where available, and it ${move}. ${promptNote} ${visualNote}`
      );
    });
  }

  return paragraphs;
}

function getTargetWords(format: string) {
  const match = format.match(/(\d{3,5})\s*(words?|word)/i);
  if (!match) return 1200;
  return Math.min(Math.max(Number(match[1]), 500), 6000);
}
