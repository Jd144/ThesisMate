export type LineIssue = {
  lineNumber: number;
  text: string;
  type: "Similarity" | "AI-Likeness";
  severity: "Low" | "Medium" | "High";
  explanation: string;
  suggestion: string;
};

const commonPhrases = ["it is important to note", "plays a vital role", "this study aims", "significant impact"];

export function analyzeLines(text: string): LineIssue[] {
  const seen = new Set<string>();
  return text.split(/\r?\n/).flatMap((raw, index) => {
    const line = raw.trim();
    if (!line) return [];
    const normalized = line.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
    const words = normalized.split(" ").filter(Boolean);
    const issues: LineIssue[] = [];

    if (seen.has(normalized) || commonPhrases.some((phrase) => normalized.includes(phrase))) {
      issues.push({
        lineNumber: index + 1,
        text: line,
        type: "Similarity",
        severity: seen.has(normalized) ? "High" : "Medium",
        explanation: seen.has(normalized)
          ? "This line repeats a sentence already present in the document."
          : "The line uses a common academic phrase or close repeated structure.",
        suggestion: "Rewrite with topic-specific detail, or add a citation if it reflects a source."
      });
    }

    const uniqueRatio = new Set(words).size / Math.max(words.length, 1);
    if (words.length > 14 && uniqueRatio < 0.72) {
      issues.push({
        lineNumber: index + 1,
        text: line,
        type: "AI-Likeness",
        severity: "High",
        explanation: "Repetitive wording and uniform structure make the sentence feel predictable.",
        suggestion: "Vary sentence length and add domain-specific evidence."
      });
    }

    seen.add(normalized);
    return issues;
  });
}
