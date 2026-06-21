import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmetModule from "helmet";
import rateLimitModule from "express-rate-limit";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { authRouter } from "./routes/auth.js";
import { gradientsRouter } from "./routes/gradients.js";
import { projectsRouter } from "./routes/projects.js";
import { publicRouter } from "./routes/public.js";

export const app = express();
const helmet = helmetModule as unknown as (options?: {
  crossOriginResourcePolicy?: { policy: "cross-origin" };
}) => express.RequestHandler;
const rateLimit = rateLimitModule as unknown as (options: {
  windowMs: number;
  limit: number;
  standardHeaders: string;
  legacyHeaders: boolean;
}) => express.RequestHandler;

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api", async (request, response, next) => {
  if (mongoose.connection.readyState === 1) return next();
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: "draft-7", legacyHeaders: false }), authRouter);
app.get("/api/health", (_request, response) => response.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } }));
app.use("/api/projects", projectsRouter);
app.use("/api/gradients", gradientsRouter);
app.use("/api", publicRouter);
app.use(notFound);
app.use(errorHandler);
