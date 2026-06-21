import express from "express";
import { resolve } from "node:path";
import { app as hueflowApp } from "./server/src/app.js";

const app = express();
const publicDirectory = resolve(process.cwd(), "public");
app.use(express.static(publicDirectory));
app.get(/^\/(?!api(?:\/|$)).*/, (_request, response) => {
  response.sendFile(resolve(publicDirectory, "index.html"));
});
app.use(hueflowApp);
export default app;
