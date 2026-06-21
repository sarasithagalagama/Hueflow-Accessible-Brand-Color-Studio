import { Router } from "express";
import mongoose from "mongoose";
import { presets } from "@hueflow/shared";
import { authenticate } from "../middleware/auth.js";
import { Favourite } from "../models/Favourite.js";
import { Gradient } from "../models/Gradient.js";
import { Project } from "../models/Project.js";
import { AppError, asyncHandler, sendData } from "../utils/http.js";

export const publicRouter = Router();
publicRouter.get("/explore", (request, response) => {
  const search = String(request.query.search ?? "").toLowerCase();
  const filter = String(request.query.filter ?? "all");
  const page = Math.max(1, Number(request.query.page) || 1);
  const limit = Math.min(24, Math.max(1, Number(request.query.limit) || 12));
  const filtered = presets.filter((preset) => (!search || `${preset.name} ${preset.tags.join(" ")}`.toLowerCase().includes(search)) && (filter === "all" || preset.tags.includes(filter) || (filter === "accessible" && preset.accessible)));
  return sendData(response, { items: filtered.slice((page - 1) * limit, page * limit), page, total: filtered.length, pages: Math.ceil(filtered.length / limit) });
});
publicRouter.get("/presets/:slug", (request, response, next) => {
  const preset = presets.find((item) => item.slug === request.params.slug);
  return preset ? sendData(response, preset) : next(new AppError(404, "Preset not found"));
});
publicRouter.get("/share/:slug", asyncHandler(async (request, response) => {
  const project = await Project.findOne({ slug: request.params.slug, visibility: "public" }).populate("owner", "name").lean();
  if (!project) throw new AppError(404, "Shared project not found");
  const gradients = await Gradient.find({ project: project._id }).select("name type angle centreX centreY noise blur aspectRatio customRatio stops").sort({ updatedAt: -1 }).lean();
  const owner = project.owner as unknown as { name: string };
  return sendData(response, {
    project: { id: String(project._id), name: project.name, slug: project.slug, description: project.description, visibility: project.visibility, tags: project.tags, updatedAt: project.updatedAt, creator: owner.name },
    gradients: gradients.map((gradient) => ({
      id: String(gradient._id), name: gradient.name,
      config: { name: gradient.name, type: gradient.type, angle: gradient.angle, centreX: gradient.centreX, centreY: gradient.centreY, noise: gradient.noise, blur: gradient.blur, aspectRatio: gradient.aspectRatio, customRatio: gradient.customRatio, stops: gradient.stops.map((stop) => ({ id: String(stop._id), name: stop.name, hex: stop.hex, position: stop.position, locked: stop.locked })) }
    }))
  });
}));
publicRouter.post("/favourites", authenticate, asyncHandler(async (request, response) => {
  const { targetType, targetId } = request.body as { targetType: "preset" | "gradient"; targetId: string };
  if (!["preset", "gradient"].includes(targetType) || !mongoose.isValidObjectId(targetId)) throw new AppError(422, "Invalid favourite");
  const favourite = await Favourite.create({ user: request.user!.id, targetType, target: targetId });
  return sendData(response, { id: String(favourite._id) }, 201);
}));
publicRouter.delete("/favourites/:targetType/:targetId", authenticate, asyncHandler(async (request, response) => {
  await Favourite.deleteOne({ user: request.user!.id, targetType: request.params.targetType, target: request.params.targetId });
  return sendData(response, null);
}));
