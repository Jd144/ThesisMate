import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { AuthRequest, requireAuth } from "../middleware.js";
import { createDocx, createPdf } from "../services/exportService.js";
import { analyzeLines } from "../services/similarityService.js";

export const toolsRouter = Router();
toolsRouter.use(requireAuth);

async function enforceFreeCheckLimit(req: AuthRequest) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { activePlan: true } });
  if (user?.activePlan !== "FREE") return;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const used = await prisma.usageEvent.count({
    where: {
      userId: req.user!.id,
      type: { in: ["SIMILARITY_CHECK"] },
      createdAt: { gte: startOfMonth }
    }
  });
  if (used >= 2) {
    throw new Error("Free monthly limit reached. Please upgrade to continue.");
  }
}

toolsRouter.post("/similarity", async (req: AuthRequest, res) => {
  const parsed = z.object({ text: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    await enforceFreeCheckLimit(req);
  } catch (error) {
    return res.status(402).json({ error: error instanceof Error ? error.message : "Plan limit reached" });
  }
  await prisma.usageEvent.create({ data: { type: "SIMILARITY_CHECK", userId: req.user!.id } });
  res.json({ issues: analyzeLines(parsed.data.text) });
});

toolsRouter.post("/spell-check", async (req: AuthRequest, res) => {
  const parsed = z.object({ text: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    await enforceFreeCheckLimit(req);
  } catch (error) {
    return res.status(402).json({ error: error instanceof Error ? error.message : "Plan limit reached" });
  }
  await prisma.usageEvent.create({ data: { type: "SIMILARITY_CHECK", userId: req.user!.id, metadata: { tool: "spell-check" } } });
  const suggestions = parsed.data.text
    .split(/\s+/)
    .filter((word: string) => word.length > 18)
    .map((word: string) => ({ word, suggestion: "Review spelling or split this long term if incorrect." }));
  res.json({ suggestions });
});

toolsRouter.post("/ai-action", async (req: AuthRequest, res) => {
  const parsed = z.object({ action: z.enum(["rewrite", "expand", "improve-tone", "add-citations"]), text: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { activePlan: true } });
  if (user?.activePlan === "FREE" || user?.activePlan === "SIMILARITY_CHECK") {
    return res.status(402).json({ error: "AI editing requires AI Tool, Combo, or Premium plan." });
  }
  await prisma.usageEvent.create({ data: { type: "AI_REQUEST", userId: req.user!.id, metadata: { action: parsed.data.action } } });
  res.json({
    suggestion: `Review suggestion for "${parsed.data.action}": keep the user's meaning, add topic-specific evidence, and verify citations.`
  });
});

toolsRouter.post("/export/:format", async (req: AuthRequest, res) => {
  const parsed = z.object({ title: z.string(), content: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  await prisma.usageEvent.create({ data: { type: "EXPORT", userId: req.user!.id, metadata: { format: req.params.format } } });

  if (req.params.format === "docx") {
    const buffer = await createDocx(parsed.data.title, parsed.data.content);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${parsed.data.title}.docx"`);
    return res.send(buffer);
  }

  if (req.params.format === "pdf") {
    const buffer = await createPdf(parsed.data.title, parsed.data.content);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${parsed.data.title}.pdf"`);
    return res.send(buffer);
  }

  if (req.params.format === "md" || req.params.format === "html") {
    res.setHeader("Content-Type", req.params.format === "md" ? "text/markdown" : "text/html");
    return res.send(parsed.data.content);
  }

  return res.status(400).json({ error: "Supported exports: pdf, docx, md, html" });
});
