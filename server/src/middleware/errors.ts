import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { AppError } from "../utils/http.js";

export const notFound: RequestHandler = (_request, _response, next) => next(new AppError(404, "Route not found"));

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
  void next;
  if (error instanceof AppError) return response.status(error.status).json({ success: false, message: error.message, errors: error.errors });
  if (error instanceof mongoose.Error.CastError) return response.status(400).json({ success: false, message: "Invalid resource identifier" });
  if (error instanceof mongoose.Error.ValidationError) return response.status(422).json({ success: false, message: "Validation failed" });
  if (typeof error === "object" && error && "code" in error && error.code === 11000) return response.status(409).json({ success: false, message: "A resource with those details already exists" });
  if (env.NODE_ENV !== "test") console.error(error);
  return response.status(500).json({ success: false, message: "Unexpected server error" });
};
