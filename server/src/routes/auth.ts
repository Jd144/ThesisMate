import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";
import { AuthRequest, requireAuth } from "../middleware.js";

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional()
});

function signToken(user: { id: string; role: "USER" | "ADMIN" }) {
  return jwt.sign(user, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}

authRouter.post("/register", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: { email: parsed.data.email, name: parsed.data.name, passwordHash }
  });
  await prisma.usageEvent.create({ data: { type: "LOGIN", userId: user.id } });
  res.status(201).json({ token: signToken({ id: user.id, role: user.role }), user });
});

authRouter.post("/login", async (req, res) => {
  const parsed = credentialsSchema.omit({ name: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user?.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  await prisma.usageEvent.create({ data: { type: "LOGIN", userId: user.id } });
  res.json({ token: signToken({ id: user.id, role: user.role }), user });
});

authRouter.post("/forgot-password", async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const tokenHash = await bcrypt.hash(`${user.id}-${Date.now()}`, 12);
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 1000 * 60 * 30) }
    });
  }
  res.json({ message: "If the email exists, a reset link can be sent by the mail provider." });
});

authRouter.patch("/profile", requireAuth, async (req: AuthRequest, res) => {
  const parsed = z.object({ name: z.string().min(2), email: z.string().email() }).safeParse(req.body);
  if (!parsed.success || !req.user) return res.status(400).json({ error: "Invalid profile" });
  const user = await prisma.user.update({ where: { id: req.user.id }, data: parsed.data });
  res.json(user);
});

authRouter.delete("/account", requireAuth, async (req: AuthRequest, res) => {
  if (!req.user || req.body.confirm !== "DELETE") return res.status(400).json({ error: "Confirmation required" });
  await prisma.user.delete({ where: { id: req.user.id } });
  res.status(204).end();
});
