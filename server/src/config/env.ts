import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

const envFiles = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "../.env")
];
const envFile = envFiles.find((path) => existsSync(path));
if (envFile) dotenv.config({ path: envFile });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/hueflow"),
  JWT_ACCESS_SECRET: z.string().min(32).default("development-only-secret-change-before-production"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  COOKIE_NAME: z.string().min(1).default("hueflow_access"),
  VERCEL_URL: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}
export const env = parsed.data;
