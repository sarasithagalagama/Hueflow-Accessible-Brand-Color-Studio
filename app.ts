import express from "express";
import { resolve } from "node:path";
import { app as hueflowApp } from "./server/src/app.js";

const app = express();
app.get(/^\/(?!api(?:\/|$)).*/, (_request, response) => {
  response.sendFile(resolve(process.cwd(), "public", "index.html"));
});
app.use(hueflowApp);
export default app;
