import mongoose from "mongoose";
import { env } from "./env.js";

let connectionPromise: Promise<void> | null = null;

export async function connectDatabase(uri = env.MONGODB_URI) {
  if (mongoose.connection.readyState === 1) return;
  if (connectionPromise) return connectionPromise;
  mongoose.set("strictQuery", true);
  connectionPromise = mongoose.connect(uri).then(() => undefined).catch((error: unknown) => {
    connectionPromise = null;
    throw error;
  });
  await connectionPromise;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  connectionPromise = null;
}
