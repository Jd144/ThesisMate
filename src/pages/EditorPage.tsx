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
          <button className="tool-btn"><FileDown size={16} /> Export</button>
        </div>
        <textarea className="document-editor" value={content} onChange={(event) => setContent(event.target.value)} />
      </SectionCard>

      <aside className="ai-sidebar">
        <h2>Prompt editor</h2>
        <p>User can type instructions like: make this formal, add citation placeholders, expand methodology, or convert to APA.</p>
        {actions.map((action) => (
          <button className="assistant-action" key={action}>{action}</button>
        ))}
        <textarea placeholder="Example: Rewrite paragraph 2 in simple academic language and add citation placeholders." />
        <div className="side-note">
          Citations and checks are assistance signals. User should verify every source before submission.
        </div>
      </aside>
    </div>
  );
}
