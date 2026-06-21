import { slugify } from "@hueflow/shared";
import { randomBytes } from "node:crypto";

export const publicSlug = (name: string) => `${slugify(name)}-${randomBytes(4).toString("hex")}`;
