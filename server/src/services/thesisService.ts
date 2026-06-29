export type ThesisInput = {
  topic: string;
  domain: string;
  objective: string;
  keywords: string[];
};

export function generateStructure(input: ThesisInput) {
  return [
    "Abstract",
    "Introduction",
    `Literature Review: ${input.domain}`,
    "Methodology",
    "Results / Analysis",
    "Discussion",
    "Conclusion and Future Scope"
  ];
}

export function generateChapterOutlines(input: ThesisInput) {
  return generateStructure(input).map((chapter, index) => ({
    title: chapter,
    order: index + 1,
    outline: [
      `Purpose connected to ${input.objective}`,
      `Key concepts: ${input.keywords.slice(0, 4).join(", ")}`,
      "Evidence needed and citation placeholders",
      "User review notes before drafting"
    ]
  }));
}

export function generateSectionDraft(input: ThesisInput, chapterTitle: string) {
  return [
    `${chapterTitle} draft chunk`,
    `This short draft focuses on ${input.topic} in the ${input.domain} domain.`,
    `The objective is to ${input.objective.toLowerCase()}`,
    "Add verified citations and project-specific evidence before finalizing."
  ].join("\n\n");
}
