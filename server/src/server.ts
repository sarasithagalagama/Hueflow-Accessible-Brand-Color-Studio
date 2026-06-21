import { createServer } from "node:http";
import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

await connectDatabase();
const server = createServer(app);
server.listen(env.PORT, () => console.log(`Hueflow API listening on http://localhost:${env.PORT}`));

const shutdown = (signal: string) => {
  console.log(`${signal} received, closing gracefully`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
