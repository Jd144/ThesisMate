import { Router } from "express";
import crypto from "crypto";
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

billingRouter.post("/razorpay/order/:plan", requireAuth, async (req: AuthRequest, res) => {
  const plan = planCatalog.find((item) => item.key === req.params.plan);
  if (!plan) return res.status(404).json({ error: "Plan not found" });
  if (plan.key === "FREE") return res.status(400).json({ error: "Free plan does not need payment" });
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(501).json({
      error: "Razorpay keys are not configured yet",
      setup: "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables."
    });
  }

  // Replace this local order object with Razorpay Orders API call after keys are set.
  res.status(201).json({
    provider: "razorpay",
    keyId: process.env.RAZORPAY_KEY_ID,
    order: {
      id: `order_demo_${Date.now()}`,
      amount: plan.amount * 100,
      currency: "INR",
      receipt: `${req.user!.id}_${plan.key}_${Date.now()}`
    },
    plan
  });
});

billingRouter.post("/razorpay/verify", requireAuth, async (req: AuthRequest, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, plan } = req.body as {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    plan?: string;
  };
  const selectedPlan = planCatalog.find((item) => item.key === plan);
  if (!selectedPlan) return res.status(400).json({ error: "Invalid plan" });
  if (!process.env.RAZORPAY_KEY_SECRET) return res.status(501).json({ error: "Razorpay secret is not configured" });

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expected !== razorpaySignature) return res.status(400).json({ error: "Invalid payment signature" });

  await prisma.planHistory.create({
    data: { plan: selectedPlan.key, amount: selectedPlan.amount, userId: req.user!.id }
  });
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      activePlan: selectedPlan.key,
      premiumUntil: selectedPlan.key === "PREMIUM" ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) : undefined
    }
  });
  res.json({ ok: true, user });
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
