import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { AuthRequest, requireAuth } from "../middleware.js";

export const projectsRouter = Router();
projectsRouter.use(requireAuth);

const projectSchema = z.object({
  title: z.string().min(3),
  domain: z.string().optional(),
  objective: z.string().optional(),
  keywords: z.array(z.string()).default([])
});

projectsRouter.get("/", async (req: AuthRequest, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.user!.id },
    include: { chapters: true, versions: { orderBy: { createdAt: "desc" }, take: 5 } },
    orderBy: { updatedAt: "desc" }
  });
  res.json(projects);
});

projectsRouter.post("/", async (req: AuthRequest, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const project = await prisma.project.create({ data: { ...parsed.data, userId: req.user!.id } });
  res.status(201).json(project);
});

projectsRouter.post("/:projectId/chapters", async (req: AuthRequest, res) => {
  const parsed = z.object({ title: z.string(), content: z.string().default(""), order: z.number() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const project = await prisma.project.findFirst({ where: { id: req.params.projectId, userId: req.user!.id } });
  if (!project) return res.status(404).json({ error: "Project not found" });
  const chapter = await prisma.chapter.create({ data: { ...parsed.data, projectId: project.id } });
  res.status(201).json(chapter);
});

projectsRouter.patch("/chapters/:chapterId", async (req: AuthRequest, res) => {
  const parsed = z.object({ content: z.string() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const chapter = await prisma.chapter.findFirst({
    where: { id: req.params.chapterId, project: { userId: req.user!.id } }
  });
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  const updated = await prisma.chapter.update({ where: { id: chapter.id }, data: parsed.data });
  res.json(updated);
});

projectsRouter.post("/:projectId/versions", async (req: AuthRequest, res) => {
  const parsed = z.object({ label: z.string(), snapshot: z.unknown() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const project = await prisma.project.findFirst({ where: { id: req.params.projectId, userId: req.user!.id } });
  if (!project) return res.status(404).json({ error: "Project not found" });
  const version = await prisma.version.create({
    data: { label: parsed.data.label, snapshot: parsed.data.snapshot as object, projectId: project.id }
  });
  res.status(201).json(version);
});
