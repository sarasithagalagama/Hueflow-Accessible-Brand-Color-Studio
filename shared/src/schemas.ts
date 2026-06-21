import { z } from "zod";

export const hexSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit HEX colour");

export const colourStopSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().trim().min(1).max(32),
  hex: hexSchema,
  position: z.number().min(0).max(100),
  locked: z.boolean()
});

export const gradientSchema = z.object({
  name: z.string().trim().min(1).max(80),
  type: z.enum(["linear", "radial", "conic", "mesh"]),
  angle: z.number().min(0).max(360),
  centreX: z.number().min(0).max(100),
  centreY: z.number().min(0).max(100),
  noise: z.number().min(0).max(100),
  blur: z.number().min(0).max(100),
  aspectRatio: z.enum(["16:9", "4:3", "1:1", "9:16", "custom"]),
  customRatio: z.string().max(20),
  stops: z.array(colourStopSchema).min(2).max(6),
  tags: z.array(z.string().trim().min(1).max(24)).max(12).optional()
});

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128)
});

export const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128)
});

export const projectInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(600).default(""),
  visibility: z.enum(["private", "public"]).default("private"),
  tags: z.array(z.string().trim().min(1).max(24)).max(12).default([])
});

export const projectPatchSchema = projectInputSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one field"
});
