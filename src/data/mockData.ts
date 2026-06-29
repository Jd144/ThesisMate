export const plans = [
  {
    name: "Free",
    price: "₹0",
    features: ["2 checks per month", "Similarity check", "Spell check only", "Paper writing locked"]
  },
  {
    name: "AI Tool",
    price: "₹250",
    features: ["Prompt-based editing", "Rewrite and expand", "Tone improvement", "No full paper export"]
  },
  {
    name: "Similarity Check",
    price: "₹250",
    features: ["More monthly checks", "Line-by-line flags", "Rewrite suggestions", "Citation prompts"]
  },
  {
    name: "Combo",
    price: "₹399",
    features: ["AI tools", "Similarity checker", "Project saving", "Basic exports"]
  },
  {
    name: "Premium",
    price: "₹2500",
    featured: true,
    features: ["Full paper builder", "Smart editor", "PDF/DOCX export", "Version history"]
  }
];

export const sampleProjects = [
  { title: "Impact of AI on Academic Writing", chapters: 5, updated: "Today", status: "Drafting" },
  { title: "Renewable Energy Adoption Report", chapters: 3, updated: "Yesterday", status: "Outline review" },
  { title: "Fintech Risk Management Study", chapters: 7, updated: "2 days ago", status: "Editing" }
];

export const usageMetrics = [
  { label: "Free checks left", value: "2" },
  { label: "Current plan", value: "Free" },
  { label: "Projects", value: "0" },
  { label: "Exports", value: "0" }
];

export const adminMetrics = [
  { label: "Active users", value: "Live API" },
  { label: "AI requests", value: "Usage DB" },
  { label: "Documents created", value: "Project DB" },
  { label: "Live sessions", value: "WebSocket" }
];
