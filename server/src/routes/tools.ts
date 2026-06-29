import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { AuthRequest, requireAuth } from "../middleware.js";
import { createDocx, createPdf } from "../services/exportService.js";
import { analyzeLines } from "../services/similarityService.js";

export const toolsRouter = Router();
toolsRouter.use(requireAuth);

toolsRouter.post("/similarity", async (req: AuthRequest, res) => {
  const parsed = z.object({ text: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  await prisma.usageEvent.create({ data: { type: "SIMILARITY_CHECK", userId: req.user!.id } });
  res.json({ issues: analyzeLines(parsed.data.text) });
});

toolsRouter.post("/ai-action", async (req: AuthRequest, res) => {
  const parsed = z.object({ action: z.enum(["rewrite", "expand", "improve-tone", "add-citations"]), text: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
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
