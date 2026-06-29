import { useMemo, useState } from "react";
import { AlertTriangle, ChevronDown, Sparkles } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { analyzeText } from "../lib/similarity";

const sampleText = `This study aims to analyze the impact of AI tools on academic writing.
It is important to note that academic writing plays a vital role in postgraduate education.
The research will show how AI tools help students improve productivity.
It is important to note that academic writing plays a vital role in postgraduate education.`;

export function SimilarityPage() {
  const [text, setText] = useState(sampleText);
  const issues = useMemo(() => analyzeText(text), [text]);

  return (
    <div className="page-grid">
      <SectionCard
        title="Similarity & AI-Likeness Checker"
        description="Line-by-line explanations with short suggestions. No guaranteed percentage claims."
      >
        <textarea className="checker-input" value={text} onChange={(event) => setText(event.target.value)} />
        <div className="issue-list">
          {issues.length === 0 ? (
            <div className="empty-state">No obvious repeated or predictable lines found in this draft.</div>
          ) : (
            issues.map((issue, index) => (
              <details className="issue-card" key={`${issue.lineNumber}-${issue.type}-${index}`}>
                <summary>
                  <span>
                    {issue.type === "Similarity" ? <AlertTriangle size={17} /> : <Sparkles size={17} />}
                    Line {issue.lineNumber}: {issue.type} ({issue.severity})
                  </span>
                  <ChevronDown size={17} />
                </summary>
                <div className="issue-body">
                  <mark>{issue.text}</mark>
                  <p><strong>Explanation:</strong> {issue.explanation}</p>
                  <p><strong>Suggestion:</strong> {issue.suggestion}</p>
                </div>
              </details>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
}
