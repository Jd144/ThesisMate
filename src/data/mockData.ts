export const plans = [
  {
    key: "FREE",
    name: "Free",
    price: "Rs 0",
    features: ["2 checks per month", "Similarity check", "Spell check only", "Paper writing locked"]
  },
  {
    key: "AI_TOOL",
    name: "AI Tool",
    price: "Rs 250",
    features: ["Prompt-based editing", "Rewrite and expand", "Tone improvement", "No full paper export"]
  },
  {
    key: "SIMILARITY_CHECK",
    name: "Similarity Check",
    price: "Rs 250",
    features: ["More monthly checks", "Line-by-line flags", "Rewrite suggestions", "Citation prompts"]
  },
  {
    key: "COMBO",
    name: "Combo",
    price: "Rs 399",
    features: ["AI tools", "Similarity checker", "Project saving", "Basic exports"]
  },
  {
    key: "PREMIUM",
    name: "Premium",
    price: "Rs 2500",
    featured: true,
    features: ["Full paper builder", "Smart editor", "PDF/DOCX export", "Version history"]
  }
];

export const sampleProjects = [
  { title: "Impact of AI on Academic Writing", chapters: 5, updated: "Today", status: "Drafting" },
  { title: "Renewable Energy Adoption Report", chapters: 3, updated: "Yesterday", status: "Outline review" },
  { title: "Fintech Risk Management Study", chapters: 7, updated: "2 days ago", status: "Editing" }
];

export const adminMetrics = [
  { label: "Active users", value: "Live API" },
  { label: "AI requests", value: "Usage DB" },
  { label: "Documents created", value: "Project DB" },
  { label: "Live sessions", value: "WebSocket" }
];
