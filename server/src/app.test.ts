import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { Project } from "./models/Project.js";

let database: MongoMemoryServer;
let cookie = "";

beforeAll(async () => {
  database = await MongoMemoryServer.create();
  await connectDatabase(database.getUri());
});
afterAll(async () => {
  await disconnectDatabase();
  await database.stop();
});

describe("Hueflow API", () => {
  it("returns structured validation errors", async () => {
    const response = await request(app).post("/api/auth/register").send({ name: "A", email: "bad", password: "short" });
    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it("registers with an HTTP-only cookie and protects project routes", async () => {
    const unauthorized = await request(app).get("/api/projects");
    expect(unauthorized.status).toBe(401);
    const registered = await request(app).post("/api/auth/register").send({ name: "Ada Colour", email: "ada@example.com", password: "correct-horse-battery" });
    expect(registered.status).toBe(201);
    const setCookie = registered.headers["set-cookie"] as unknown as string[];
    expect(setCookie[0]).toContain("HttpOnly");
    cookie = setCookie[0]!.split(";")[0]!;
    const projects = await request(app).get("/api/projects").set("Cookie", cookie);
    expect(projects.status).toBe(200);
  });

  it("creates a project and rejects private share access", async () => {
    const created = await request(app).post("/api/projects").set("Cookie", cookie).send({ name: "Private palette", description: "", visibility: "private", tags: [] });
    expect(created.status).toBe(201);
    const share = await request(app).get(`/api/share/${created.body.data.slug}`);
    expect(share.status).toBe(404);
    await Project.updateOne({ slug: created.body.data.slug }, { visibility: "public" });
    const publicShare = await request(app).get(`/api/share/${created.body.data.slug}`);
    expect(publicShare.status).toBe(200);
  });

  it("serves paginated presets and health", async () => {
    const health = await request(app).get("/api/health");
    expect(health.status).toBe(200);
    const explore = await request(app).get("/api/explore?limit=5&filter=warm");
    expect(explore.body.data.items.length).toBeLessThanOrEqual(5);
  });
});
