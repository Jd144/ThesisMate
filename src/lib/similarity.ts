export type SimilarityIssue = {
  lineNumber: number;
  text: string;
  type: "Similarity" | "AI-Likeness";
  severity: "Low" | "Medium" | "High";
  explanation: string;
  suggestion: string;
};

const repeatedAcademicPhrases = [
  "it is important to note",
  "in today's world",
  "plays a vital role",
  "this study aims to",
  "significant impact"
];

export function analyzeText(text: string): SimilarityIssue[] {
  const lines = text.split(/\r?\n/);
  const seen = new Map<string, number>();

  return lines.flatMap((raw, index) => {
    const line = raw.trim();
    if (!line) return [];
    const normalized = line.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
    const words = normalized.split(" ").filter(Boolean);
    const issues: SimilarityIssue[] = [];

    if (repeatedAcademicPhrases.some((phrase) => normalized.includes(phrase)) || seen.has(normalized)) {
      issues.push({
        lineNumber: index + 1,
        text: line,
        type: "Similarity",
        severity: seen.has(normalized) ? "High" : "Medium",
        explanation: seen.has(normalized)
          ? "This line repeats wording already used earlier in the document."
          : "The sentence uses common academic phrasing that may need more specific wording.",
        suggestion: "Rewrite with details from your topic, or add a citation if the idea comes from a source."
      });
    }

    const uniqueRatio = new Set(words).size / Math.max(words.length, 1);
    const predictable = words.length > 14 && uniqueRatio < 0.72;
    if (predictable || /^(this|the) (study|research|paper) (will|aims|shows)/i.test(line)) {
      issues.push({
        lineNumber: index + 1,
        text: line,
        type: "AI-Likeness",
        severity: predictable ? "High" : "Medium",
        explanation: predictable
          ? "Repetitive wording and low variation make the sentence feel predictable."
          : "The line follows a very uniform academic pattern.",
        suggestion: "Add domain-specific terms, vary sentence rhythm, and include concrete evidence."
      });
    }

    seen.set(normalized, index + 1);
    return issues;
  });
}
