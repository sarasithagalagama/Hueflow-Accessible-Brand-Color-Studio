import { Router } from "express";
import mongoose from "mongoose";
import { gradientSchema, projectInputSchema, projectPatchSchema } from "@hueflow/shared";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { Favourite } from "../models/Favourite.js";
import { Gradient } from "../models/Gradient.js";
import { Project } from "../models/Project.js";
import { AppError, asyncHandler, sendData } from "../utils/http.js";
import { publicSlug } from "../utils/slug.js";

export const projectsRouter = Router();
projectsRouter.use(authenticate);
const validId = (id: unknown) => {
  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) throw new AppError(400, "Invalid resource identifier");
  return id;
};
const projectView = (project: Record<string, unknown>) => ({
  id: String(project._id), name: project.name, slug: project.slug, description: project.description,
  visibility: project.visibility, tags: project.tags, updatedAt: project.updatedAt
});

projectsRouter.get("/", asyncHandler(async (request, response) => {
  const projects = await Project.find({ owner: request.user!.id }).sort({ updatedAt: -1 }).select("name slug description visibility tags updatedAt").limit(100).lean();
  return sendData(response, projects.map((project) => projectView(project as unknown as Record<string, unknown>)));
}));

projectsRouter.post("/", validateBody(projectInputSchema), asyncHandler(async (request, response) => {
  const project = await Project.create({ ...request.body, owner: request.user!.id, slug: publicSlug(request.body.name) });
  return sendData(response, projectView(project.toObject()), 201, "Project created");
}));

projectsRouter.get("/:projectId", asyncHandler(async (request, response) => {
  const project = await Project.findOne({ _id: validId(request.params.projectId), owner: request.user!.id }).lean();
  if (!project) throw new AppError(404, "Project not found");
  return sendData(response, projectView(project as unknown as Record<string, unknown>));
}));

projectsRouter.patch("/:projectId", validateBody(projectPatchSchema), asyncHandler(async (request, response) => {
  const project = await Project.findOneAndUpdate({ _id: validId(request.params.projectId), owner: request.user!.id }, { $set: request.body }, { new: true, runValidators: true }).lean();
  if (!project) throw new AppError(404, "Project not found");
  return sendData(response, projectView(project as unknown as Record<string, unknown>), 200, "Project updated");
}));

projectsRouter.delete("/:projectId", asyncHandler(async (request, response) => {
  const project = await Project.findOneAndDelete({ _id: validId(request.params.projectId), owner: request.user!.id });
  if (!project) throw new AppError(404, "Project not found");
  const gradients = await Gradient.find({ project: project._id }).select("_id").lean();
  const gradientIds = gradients.map((gradient) => gradient._id);
  await Promise.all([Gradient.deleteMany({ project: project._id }), Favourite.deleteMany({ targetType: "gradient", target: { $in: gradientIds } })]);
  return sendData(response, null, 200, "Project deleted");
}));

projectsRouter.post("/:projectId/duplicate", asyncHandler(async (request, response) => {
  const source = await Project.findOne({ _id: validId(request.params.projectId), owner: request.user!.id }).lean();
  if (!source) throw new AppError(404, "Project not found");
  const duplicate = await Project.create({ owner: request.user!.id, name: `${source.name} copy`, slug: publicSlug(`${source.name} copy`), description: source.description, visibility: "private", tags: source.tags });
  const gradients = await Gradient.find({ project: source._id, owner: request.user!.id }).lean();
  if (gradients.length) await Gradient.insertMany(gradients.map((gradient) => ({
    project: duplicate._id,
    owner: request.user!.id,
    name: gradient.name,
    type: gradient.type,
    angle: gradient.angle,
    centreX: gradient.centreX,
    centreY: gradient.centreY,
    noise: gradient.noise,
    blur: gradient.blur,
    aspectRatio: gradient.aspectRatio,
    customRatio: gradient.customRatio,
    stops: gradient.stops,
    tags: gradient.tags,
    saveCount: 0
  })));
  return sendData(response, projectView(duplicate.toObject()), 201, "Project duplicated");
}));

projectsRouter.get("/:projectId/gradients", asyncHandler(async (request, response) => {
  const projectId = validId(request.params.projectId);
  if (!await Project.exists({ _id: projectId, owner: request.user!.id })) throw new AppError(404, "Project not found");
  const gradients = await Gradient.find({ project: projectId, owner: request.user!.id }).sort({ updatedAt: -1 }).limit(50).lean();
  return sendData(response, gradients.map((gradient) => ({ ...gradient, id: String(gradient._id), _id: undefined })));
}));

projectsRouter.post("/:projectId/gradients", validateBody(gradientSchema), asyncHandler(async (request, response) => {
  const projectId = validId(request.params.projectId);
  if (!await Project.exists({ _id: projectId, owner: request.user!.id })) throw new AppError(404, "Project not found");
  const { stops, ...data } = request.body as import("@hueflow/shared").GradientConfig & { tags?: string[] };
  const gradient = await Gradient.create({
    ...data, project: projectId, owner: request.user!.id,
    stops: stops.map((stop, order) => ({ name: stop.name, hex: stop.hex.toUpperCase(), position: stop.position, locked: stop.locked, order }))
  });
  await Project.updateOne({ _id: projectId }, { $set: { updatedAt: new Date() } });
  return sendData(response, { id: String(gradient._id), name: gradient.name }, 201, "Gradient saved");
}));
