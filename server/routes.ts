import { Express } from "express";
import { storage } from "./storage.js";

export function registerRoutes(app: Express) {
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      service: "caBE Arena API",
      env: process.env.NODE_ENV || "development"
    });
  });

  // ---- Tasks ----
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.get("/api/tasks/:id", async (req, res) => {
    const task = await storage.getTask(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  });

  // ---- Submissions ----
  app.post("/api/submissions", async (req, res) => {
    const result = await storage.createSubmission(req.body);
    res.json(result);
  });

  console.log("🔧 API routes registered");
}
