import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/http.js";

export function authenticate(request: Request, _response: Response, next: NextFunction) {
  const token = request.cookies[env.COOKIE_NAME] as string | undefined;
  if (!token) return next(new AppError(401, "Authentication required"));
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string };
    request.user = { id: payload.sub };
    next();
  } catch {
    next(new AppError(401, "Authentication required"));
  }
}
