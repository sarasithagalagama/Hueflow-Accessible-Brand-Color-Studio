import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { Project } from "./models/Project.js";
import { presets } from "@hueflow/shared";

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

  it("saves, updates, lists, and duplicates project gradients", async () => {
    const created = await request(app).post("/api/projects").set("Cookie", cookie).send({ name: "Brand system", description: "Client colours", visibility: "private", tags: ["brand"] });
    const projectId = created.body.data.id as string;
    const saved = await request(app).post(`/api/projects/${projectId}/gradients`).set("Cookie", cookie).send({ ...presets[0]!.config, tags: ["hero"] });
    expect(saved.status).toBe(201);
    expect(saved.body.data.config.name).toBe("Sunset Glow");

    const listed = await request(app).get(`/api/projects/${projectId}/gradients`).set("Cookie", cookie);
    expect(listed.body.data).toHaveLength(1);
    expect(listed.body.data[0].projectId).toBe(projectId);

    const updated = await request(app).patch(`/api/gradients/${saved.body.data.id}`).set("Cookie", cookie).send({ name: "Updated system" });
    expect(updated.status).toBe(200);
    expect(updated.body.data.name).toBe("Updated system");

    const projectList = await request(app).get("/api/projects").set("Cookie", cookie);
    const summary = projectList.body.data.find((project: { id: string }) => project.id === projectId);
    expect(summary.gradientCount).toBe(1);
    expect(summary.previewGradient.name).toBe("Updated system");

    const duplicated = await request(app).post(`/api/projects/${projectId}/duplicate`).set("Cookie", cookie);
    expect(duplicated.status).toBe(201);
    const duplicateGradients = await request(app).get(`/api/projects/${duplicated.body.data.id}/gradients`).set("Cookie", cookie);
    expect(duplicateGradients.body.data).toHaveLength(1);
  });

  it("serves paginated presets and health", async () => {
    const health = await request(app).get("/api/health");
    expect(health.status).toBe(200);
    const explore = await request(app).get("/api/explore?limit=5&filter=warm");
    expect(explore.body.data.items.length).toBeLessThanOrEqual(5);
  });
});
