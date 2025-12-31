import { Express } from "express";
import { Server } from "http";
import { MOCK_TASKS } from "./mockData.js";

export async function registerRoutes(_http: Server, app: Express) {
  console.log("🔧 Registering API routes…");

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "caBE backend" });
  });

  // Get all tasks (mock only — safe + deterministic)
  app.get("/api/tasks", (_req, res) => {
    res.json({
      ok: true,
      data: MOCK_TASKS
    });
  });

  // Get task by ID
  app.get("/api/tasks/:id", (req, res) => {
    const task = MOCK_TASKS.find(t => String(t.id) === req.params.id);

    if (!task) {
      return res.status(404).json({
        ok: false,
        message: "Task not found"
      });
    }

    res.json({ ok: true, data: task });
  });

  console.log("✅ API routes ready");
}
