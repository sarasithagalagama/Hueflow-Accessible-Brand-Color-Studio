import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { loginSchema, registerSchema } from "@hueflow/shared";
import { env } from "../config/env.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { User } from "../models/User.js";
import { AppError, asyncHandler, sendData } from "../utils/http.js";

export const authRouter = Router();

const publicUser = (user: { _id: unknown; name: string; email: string; image?: string | null }) => ({
  id: String(user._id), name: user.name, email: user.email, ...(user.image ? { image: user.image } : {})
});
const setCookie = (response: import("express").Response, userId: string) => {
  const options: SignOptions = { subject: userId, expiresIn: env.JWT_ACCESS_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]> };
  const token = jwt.sign({}, env.JWT_ACCESS_SECRET, options);
  response.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/"
  });
};

authRouter.post("/register", validateBody(registerSchema), asyncHandler(async (request, response) => {
  const { name, email, password } = request.body as { name: string; email: string; password: string };
  if (await User.exists({ email })) throw new AppError(409, "An account with those details already exists");
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
  setCookie(response, String(user._id));
  return sendData(response, publicUser(user), 201, "Account created");
}));

authRouter.post("/login", validateBody(loginSchema), asyncHandler(async (request, response) => {
  const { email, password } = request.body as { email: string; password: string };
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError(401, "Invalid email or password");
  setCookie(response, String(user._id));
  return sendData(response, publicUser(user), 200, "Signed in");
}));

authRouter.post("/logout", (_request, response) => {
  response.clearCookie(env.COOKIE_NAME, { path: "/", httpOnly: true, secure: env.NODE_ENV === "production", sameSite: env.NODE_ENV === "production" ? "none" : "lax" });
  return sendData(response, null, 200, "Signed out");
});

authRouter.get("/me", (request, response, next) => {
  if (!request.cookies[env.COOKIE_NAME]) return sendData(response, null);
  authenticate(request, response, next);
}, asyncHandler(async (request, response) => {
  const user = await User.findById(request.user!.id).select("name email image").lean();
  if (!user) return sendData(response, null);
  return sendData(response, publicUser(user));
}));
