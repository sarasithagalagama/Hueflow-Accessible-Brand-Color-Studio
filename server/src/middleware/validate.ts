import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../utils/http.js";

export const validateBody = (schema: ZodType) => (request: Request, _response: Response, next: NextFunction) => {
  const parsed = schema.safeParse(request.body);
  if (!parsed.success) {
    return next(new AppError(422, "Validation failed", parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }))));
  }
  request.body = parsed.data;
  next();
};
