import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { AuthRequest, requireAuth } from "../middleware.js";
import { generateChapterOutlines, generateSectionDraft, generateStructure } from "../services/thesisService.js";

export const thesisRouter = Router();

const thesisSchema = z.object({
  topic: z.string().min(3),
  domain: z.string().min(2),
  objective: z.string().min(5),
  keywords: z.string().transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean)),
  dataFileName: z.string().optional(),
  sampleFileName: z.string().optional()
});

async function requirePaperPlan(req: AuthRequest, res: { status: (code: number) => { json: (body: unknown) => void } }) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { activePlan: true } });
  if (user?.activePlan === "FREE" || user?.activePlan === "SIMILARITY_CHECK") {
    res.status(402).json({ error: "Paper writing requires AI Tool, Combo, or Premium plan." });
    return false;
  }
  return true;
}

thesisRouter.post("/structure", requireAuth, async (req: AuthRequest, res) => {
  if (!(await requirePaperPlan(req, res))) return;
  const parsed = thesisSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  res.json({
    structure: generateStructure(parsed.data),
    receivedFiles: {
      dataFileName: parsed.data.dataFileName,
      sampleFileName: parsed.data.sampleFileName
    }
  });
});

thesisRouter.post("/outlines", requireAuth, async (req: AuthRequest, res) => {
  if (!(await requirePaperPlan(req, res))) return;
  const parsed = thesisSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  res.json({ outlines: generateChapterOutlines(parsed.data) });
});

thesisRouter.post("/draft", requireAuth, async (req: AuthRequest, res) => {
  if (!(await requirePaperPlan(req, res))) return;
  const parsed = thesisSchema.extend({ chapterTitle: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  res.json({ draft: generateSectionDraft(parsed.data, parsed.data.chapterTitle) });
});
