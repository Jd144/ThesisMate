import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { AuthRequest, requireAdmin, requireAuth } from "../middleware.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      premiumUntil: true,
      createdAt: true,
      _count: { select: { projects: true, usageEvents: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  res.json(users);
});

adminRouter.patch("/users/:userId/premium", async (req, res) => {
  const parsed = z.object({ grant: z.boolean() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const premiumUntil = parsed.data.grant ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) : null;
  const user = await prisma.user.update({
    where: { id: req.params.userId },
    data: { premiumUntil, activePlan: parsed.data.grant ? "PREMIUM" : "FREE" }
  });
  res.json(user);
});

adminRouter.patch("/users/:userId/reset-password", async (req, res) => {
  const parsed = z.object({ temporaryPassword: z.string().min(8) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const passwordHash = await bcrypt.hash(parsed.data.temporaryPassword, 12);
  await prisma.user.update({ where: { id: req.params.userId }, data: { passwordHash } });
  res.json({ message: "Password reset complete" });
});

adminRouter.get("/metrics", async (req: AuthRequest, res) => {
  const [activeUsers, aiUsage, documentsCreated, liveSessions] = await Promise.all([
    prisma.user.count({ where: { usageEvents: { some: { createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24) } } } } }),
    prisma.usageEvent.count({ where: { type: "AI_REQUEST" } }),
    prisma.project.count(),
    prisma.usageEvent.count({ where: { type: "LIVE_SESSION", createdAt: { gte: new Date(Date.now() - 1000 * 60 * 5) } } })
  ]);
  res.json({ activeUsers, aiUsage, documentsCreated, liveSessions, requestedBy: req.user!.id });
});
