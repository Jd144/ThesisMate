import { useMemo, useState } from "react";
import { AlertTriangle, ChevronDown, SpellCheck, Sparkles } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { analyzeText, SimilarityIssue } from "../lib/similarity";
import { planLabel, useAppState } from "../lib/appState";

const sampleText = `This study aims to analyze the impact of AI tools on academic writing.
It is important to note that academic writing plays a vital role in postgraduate education.
The research will show how AI tools help students improve productivity.
It is important to note that academic writing plays a vital role in postgraduate education.`;

export function SimilarityPage() {
  const { plan, freeChecksLeft, useCheck } = useAppState();
  const [text, setText] = useState(sampleText);
  const [issues, setIssues] = useState<SimilarityIssue[]>([]);
  const [spellSuggestions, setSpellSuggestions] = useState<string[]>([]);
  const [message, setMessage] = useState("Paste text and run a check.");

  const badge = useMemo(() => (
    plan === "FREE" ? `${freeChecksLeft} free checks left` : `${planLabel(plan)} checks active`
  ), [freeChecksLeft, plan]);

  function runSimilarity() {
    const result = useCheck();
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setSpellSuggestions([]);
    setIssues(analyzeText(text));
    setMessage("Similarity and AI-likeness check completed.");
  }

  function runSpellCheck() {
    const result = useCheck();
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setIssues([]);
    const suggestions = text
      .split(/\s+/)
      .map((word) => word.replace(/[^\w-]/g, ""))
      .filter((word) => word.length > 18)
      .map((word) => `Review "${word}" for spelling or split it if needed.`);
    setSpellSuggestions(suggestions.length ? suggestions : ["No obvious long-word spelling issues found."]);
    setMessage("Spell check completed.");
  }

  return (
    <div className="page-grid">
      <SectionCard
        title="Similarity & Spell Checker"
        description="Buttons now run checks and track plan limits. Free plan allows 2 checks per month."
        action={<span className="badge">{badge}</span>}
      >
        <div className="button-row check-mode-row">
          <button className="primary-action" onClick={runSimilarity}><AlertTriangle size={16} /> Similarity check</button>
          <button className="secondary-action" onClick={runSpellCheck}><SpellCheck size={16} /> Spell check</button>
        </div>
        <textarea className="checker-input" value={text} onChange={(event) => setText(event.target.value)} />
        <p className="form-message">{message}</p>
        {spellSuggestions.length ? (
          <div className="issue-list">
            {spellSuggestions.map((suggestion) => (
              <div className="issue-card" key={suggestion}>{suggestion}</div>
            ))}
          </div>
        ) : null}
        <div className="issue-list">
          {issues.length === 0 && !spellSuggestions.length ? (
            <div className="empty-state">Run a check to see line-by-line results.</div>
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
