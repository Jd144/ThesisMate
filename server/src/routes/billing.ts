import { Router } from "express";
import { prisma } from "../db.js";
import { AuthRequest, requireAuth } from "../middleware.js";

export const billingRouter = Router();

export const planCatalog = [
  { key: "FREE", name: "Free", amount: 0, monthlyChecks: 2, unlocks: ["2 similarity/spell checks per month"] },
  { key: "AI_TOOL", name: "AI Tool", amount: 250, unlocks: ["AI sidebar tools"] },
  { key: "SIMILARITY_CHECK", name: "Similarity Check", amount: 250, unlocks: ["Similarity checker"] },
  { key: "COMBO", name: "Combo", amount: 399, unlocks: ["AI tools", "Similarity checker", "Project saving"] },
  { key: "PREMIUM", name: "Premium", amount: 2500, unlocks: ["Full editor", "Thesis builder", "Export system"] }
] as const;

billingRouter.get("/plans", (_req, res) => {
  res.json(planCatalog);
});

billingRouter.post("/subscribe/:plan", requireAuth, async (req: AuthRequest, res) => {
  const plan = planCatalog.find((item) => item.key === req.params.plan);
  if (!plan) return res.status(404).json({ error: "Plan not found" });
  const history = await prisma.planHistory.create({
    data: { plan: plan.key, amount: plan.amount, userId: req.user!.id }
  });
  await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      activePlan: plan.key,
      premiumUntil: plan.key === "PREMIUM" ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) : undefined
    }
  });
  res.status(201).json(history);
});
