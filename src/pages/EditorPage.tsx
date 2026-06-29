import { Bold, FileDown, Image, Italic, List, Table2, Workflow } from "lucide-react";
import { useState } from "react";
import { SectionCard } from "../components/SectionCard";

const actions = ["Rewrite", "Expand", "Improve tone", "Add citations"];

export function EditorPage() {
  const [content, setContent] = useState(
    "Chapter 1: Introduction\n\nThis study aims to examine how AI-assisted academic tools support thesis planning and revision.\n\n[Insert Table 1 here]\n[Insert Figure 2 here]"
  );

  const insert = (text: string) => setContent((value) => `${value}\n${text}`);

  return (
    <div className="editor-layout">
      <SectionCard
        title="Smart Editor"
        description="Rich text style workspace with insert tools, autosave status, and export actions."
        action={<span className="badge success">Auto-saved</span>}
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
          <button className="tool-btn"><FileDown size={16} /> Export</button>
        </div>
        <textarea className="document-editor" value={content} onChange={(event) => setContent(event.target.value)} />
      </SectionCard>

      <aside className="ai-sidebar">
        <h2>AI assistant</h2>
        <p>Apply changes to selected text or generate a suggestion for review.</p>
        {actions.map((action) => (
          <button className="assistant-action" key={action}>{action}</button>
        ))}
        <div className="side-note">
          Citations are suggestions only. Users should verify sources and formatting before submission.
        </div>
      </aside>
    </div>
  );
}
