import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { billingRouter } from "./routes/billing.js";
import { projectsRouter } from "./routes/projects.js";
import { thesisRouter } from "./routes/thesis.js";
import { toolsRouter } from "./routes/tools.js";
import { prisma } from "./db.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" }
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ThesisMate API" });
});

app.use("/api/auth", authRouter);
app.use("/api/billing", billingRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/thesis", thesisRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/admin", adminRouter);

async function bootstrapMasterAdmin() {
  const email = process.env.MASTER_ADMIN_EMAIL;
  const password = process.env.MASTER_ADMIN_PASSWORD;
  if (!email || !password) return;
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", activePlan: "PREMIUM" },
    create: {
      email,
      name: "Master Admin",
      role: "ADMIN",
      activePlan: "PREMIUM",
      premiumUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
      passwordHash
    }
  });
}

io.on("connection", async (socket) => {
  await prisma.usageEvent.create({ data: { type: "LIVE_SESSION", metadata: { socketId: socket.id } } });
  io.emit("presence:update", { activeSockets: io.engine.clientsCount });

  socket.on("usage:track", async (payload: { type?: string; metadata?: unknown; userId?: string }) => {
    await prisma.usageEvent.create({
      data: {
        type: payload.type === "AI_REQUEST" ? "AI_REQUEST" : "LIVE_SESSION",
        metadata: payload.metadata as object,
        userId: payload.userId
      }
    });
  });

  socket.on("disconnect", () => {
    io.emit("presence:update", { activeSockets: io.engine.clientsCount });
  });
});

const port = Number(process.env.PORT || 4000);
bootstrapMasterAdmin()
  .then(() => {
    server.listen(port, () => {
      console.log(`ThesisMate API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to bootstrap server", error);
    process.exit(1);
  });
