import { Router } from "express";
import mongoose from "mongoose";
import { gradientSchema } from "@hueflow/shared";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { Gradient } from "../models/Gradient.js";
import { AppError, asyncHandler, sendData } from "../utils/http.js";

export const gradientsRouter = Router();
gradientsRouter.use(authenticate);
const id = (value: unknown) => {
  if (typeof value !== "string" || !mongoose.isValidObjectId(value)) throw new AppError(400, "Invalid resource identifier");
  return value;
};
interface GradientRecord {
  _id: unknown;
  project: unknown;
  name: string;
  type: string;
  angle: number;
  centreX: number;
  centreY: number;
  noise: number;
  blur: number;
  aspectRatio: string;
  customRatio: string;
  stops: Array<{ _id: unknown; name: string; hex: string; position: number; locked: boolean }>;
  tags?: string[];
  createdAt: unknown;
  updatedAt: unknown;
}
const gradientView = (gradient: GradientRecord) => ({
  id: String(gradient._id),
  projectId: String(gradient.project),
  name: gradient.name,
  config: {
    name: gradient.name,
    type: gradient.type,
    angle: gradient.angle,
    centreX: gradient.centreX,
    centreY: gradient.centreY,
    noise: gradient.noise,
    blur: gradient.blur,
    aspectRatio: gradient.aspectRatio,
    customRatio: gradient.customRatio,
    stops: gradient.stops.map((stop) => ({
      id: String(stop._id),
      name: stop.name,
      hex: stop.hex,
      position: stop.position,
      locked: stop.locked
    }))
  },
  tags: gradient.tags ?? [],
  createdAt: gradient.createdAt,
  updatedAt: gradient.updatedAt
});
gradientsRouter.get("/:gradientId", asyncHandler(async (request, response) => {
  const gradient = await Gradient.findOne({ _id: id(request.params.gradientId), owner: request.user!.id }).lean();
  if (!gradient) throw new AppError(404, "Gradient not found");
  return sendData(response, gradientView(gradient as unknown as GradientRecord));
}));
gradientsRouter.patch("/:gradientId", validateBody(gradientSchema.partial()), asyncHandler(async (request, response) => {
  const update: Record<string, unknown> = {};
  const fields = ["name", "type", "angle", "centreX", "centreY", "noise", "blur", "aspectRatio", "customRatio", "tags"] as const;
  for (const field of fields) if (field in request.body) update[field] = request.body[field];
  if (request.body.stops) update.stops = request.body.stops.map((stop: Record<string, unknown>, order: number) => ({ ...stop, order, id: undefined }));
  const gradient = await Gradient.findOneAndUpdate({ _id: id(request.params.gradientId), owner: request.user!.id }, { $set: update }, { new: true, runValidators: true }).lean();
  if (!gradient) throw new AppError(404, "Gradient not found");
  return sendData(response, gradientView(gradient as unknown as GradientRecord), 200, "Gradient updated");
}));
gradientsRouter.delete("/:gradientId", asyncHandler(async (request, response) => {
  const gradient = await Gradient.findOneAndDelete({ _id: id(request.params.gradientId), owner: request.user!.id });
  if (!gradient) throw new AppError(404, "Gradient not found");
  return sendData(response, null, 200, "Gradient deleted");
}));
