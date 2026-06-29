import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware.js";
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

thesisRouter.post("/structure", requireAuth, (req, res) => {
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

thesisRouter.post("/outlines", requireAuth, (req, res) => {
  const parsed = thesisSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  res.json({ outlines: generateChapterOutlines(parsed.data) });
});

thesisRouter.post("/draft", requireAuth, (req, res) => {
  const parsed = thesisSchema.extend({ chapterTitle: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  res.json({ draft: generateSectionDraft(parsed.data, parsed.data.chapterTitle) });
});
