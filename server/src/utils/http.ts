import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  constructor(public status: number, message: string, public errors?: Array<{ path: string; message: string }>) {
    super(message);
  }
}

export const asyncHandler = (handler: (request: Request, response: Response, next: NextFunction) => Promise<unknown>) =>
  (request: Request, response: Response, next: NextFunction) => void handler(request, response, next).catch(next);

export const sendData = <T>(response: Response, data: T, status = 200, message?: string) =>
  response.status(status).json({ success: true, data, ...(message ? { message } : {}) });
