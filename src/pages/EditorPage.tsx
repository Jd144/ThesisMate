import { Bold, FileDown, Image, Italic, List, Table2, Workflow } from "lucide-react";
import { Document, Packer, Paragraph } from "docx";
import { useState } from "react";
import { SectionCard } from "../components/SectionCard";
import { useAppState } from "../lib/appState";

const actions = ["Rewrite", "Expand", "Improve tone", "Add citations"];

export function EditorPage() {
  const { recordExport } = useAppState();
  const [content, setContent] = useState(
    () => localStorage.getItem("thesismate-last-paper") ||
      "Chapter 1: Introduction\n\nThis study aims to examine how AI-assisted academic tools support thesis planning and revision.\n\n[Insert Table 1 here]\n[Insert Figure 2 here]"
  );
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("Editor ready.");

  const insert = (text: string) => setContent((value) => `${value}\n${text}`);
  const applyAction = (action: string) => {
    const note = prompt || `Apply ${action.toLowerCase()} to the selected paragraph.`;
    setContent((value) => `${value}\n\n[AI ${action} suggestion]\n${note}\nPlease review this suggestion before final submission.`);
    setMessage(`${action} suggestion inserted for review.`);
  };
  const exportDocument = async (format: "pdf" | "docx" | "md" | "html") => {
    const title = localStorage.getItem("thesismate-last-paper-title") || "ThesisMate Paper";
    const filename = slugify(title);

    if (format === "docx") {
      const doc = new Document({
        sections: [
          {
            children: content.split(/\r?\n/).map((line) => new Paragraph(line || " "))
          }
        ]
      });
      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, `${filename}.docx`);
      recordExport();
      setMessage("DOCX downloaded.");
      return;
    }

    if (format === "pdf") {
      downloadBlob(createSimplePdf(title, content), `${filename}.pdf`);
      recordExport();
      setMessage("PDF downloaded.");
      return;
    }

    if (format === "html") {
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head><body><pre>${escapeHtml(content)}</pre></body></html>`;
      downloadBlob(new Blob([html], { type: "text/html;charset=utf-8" }), `${filename}.html`);
      recordExport();
      setMessage("HTML downloaded.");
      return;
    }

    downloadBlob(new Blob([content], { type: "text/markdown;charset=utf-8" }), `${filename}.md`);
    recordExport();
    setMessage("Markdown downloaded.");
  };

  return (
    <div className="editor-layout">
      <SectionCard
        title="Smart Editor"
        description="Paid workspace: edit manually or give prompts for rewrite, format, citation, and section changes."
        action={<span className="badge success">Premium feature</span>}
      >
        <div className="toolbar">
          {[Bold, Italic, List].map((Icon, index) => (
            <button className="icon-btn" key={index} title="Formatting control">
              <Icon size={17} />
            </button>
          ))}
          <button className="tool-btn" onClick={() => insert("[Insert Table 1 here]")}><Table2 size={16} /> Table</button>
          <button className="tool-btn" onClick={() => insert("[Insert Figure 2 here]")}><Image size={16} /> Figure</button>
          <button className="tool-btn" onClick={() => insert("[Insert Flowchart 1 here]")}><Workflow size={16} /> Flowchart</button>
          <button className="tool-btn" onClick={() => exportDocument("pdf")}><FileDown size={16} /> PDF</button>
          <button className="tool-btn" onClick={() => exportDocument("docx")}><FileDown size={16} /> DOCX</button>
          <button className="tool-btn" onClick={() => exportDocument("md")}><FileDown size={16} /> MD</button>
          <button className="tool-btn" onClick={() => exportDocument("html")}><FileDown size={16} /> HTML</button>
        </div>
        <p className="form-message">{message}</p>
        <textarea className="document-editor" value={content} onChange={(event) => setContent(event.target.value)} />
      </SectionCard>

      <aside className="ai-sidebar">
        <h2>Prompt editor</h2>
        <p>User can type instructions like: make this formal, add citation placeholders, expand methodology, or convert to APA.</p>
        {actions.map((action) => (
          <button className="assistant-action" key={action} onClick={() => applyAction(action)}>{action}</button>
        ))}
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Example: Rewrite paragraph 2 in simple academic language and add citation placeholders." />
        <div className="side-note">
          Citations and checks are assistance signals. User should verify every source before submission.
        </div>
      </aside>
    </div>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "thesismate-paper";
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createSimplePdf(title: string, content: string) {
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 48;
  const lineHeight = 15;
  const maxChars = 88;
  const lines = wrapLines([title, "", ...content.split(/\r?\n/)], maxChars);
  const footerSpace = 34;
  const linesPerPage = Math.floor((pageHeight - margin * 2 - footerSpace) / lineHeight);
  const pages: string[][] = [];
  for (let index = 0; index < lines.length; index += linesPerPage) {
    pages.push(lines.slice(index, index + linesPerPage));
  }

  const objects: string[] = [];
  const pageRefs: number[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("");

  pages.forEach((pageLines, pageIndex) => {
    const contentObjectNumber = objects.length + 2;
    const pageObjectNumber = objects.length + 1;
    pageRefs.push(pageObjectNumber);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentObjectNumber} 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>`);
    const stream = buildPdfTextStream(pageLines, margin, pageHeight - margin, lineHeight, `Page ${pageIndex + 1} of ${pages.length}`, pageWidth, margin);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(" ")}] /Count ${pageRefs.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function wrapLines(lines: string[], maxChars: number) {
  return lines.flatMap((line) => {
    if (!line.trim()) return [""];
    const words = line.split(/\s+/);
    const wrapped: string[] = [];
    let current = "";
    words.forEach((word) => {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxChars) {
        wrapped.push(current);
        current = word;
      } else {
        current = next;
      }
    });
    if (current) wrapped.push(current);
    return wrapped;
  });
}

function buildPdfTextStream(lines: string[], x: number, yStart: number, lineHeight: number, footer: string, pageWidth: number, margin: number) {
  const escapedLines = lines.map((line, index) => {
    const y = yStart - index * lineHeight;
    return `BT /F1 11 Tf ${x} ${y} Td (${escapePdfText(line)}) Tj ET`;
  });
  const footerX = pageWidth - margin - 90;
  return `${escapedLines.join("\n")}\nBT /F1 9 Tf ${footerX} 28 Td (${escapePdfText(footer)}) Tj ET`;
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
