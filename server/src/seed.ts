import { presets } from "@hueflow/shared";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

await connectDatabase();
console.log(`Hueflow ships ${presets.length} read-only presets from the shared package.`);
console.log("User-generated projects and gradients use MongoDB; no destructive seed operation was needed.");
await disconnectDatabase();
