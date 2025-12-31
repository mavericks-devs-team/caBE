import { Express } from "express";
import { MOCK_TASKS } from "./mockData.js";

export function registerRoutes(app: Express) {
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "caBE Arena API" });
  });

  // Get all tasks
  app.get("/api/tasks", (_req, res) => {
    res.json(MOCK_TASKS);
  });

  // Get task by id
  app.get("/api/tasks/:id", (req, res) => {
    const task = MOCK_TASKS.find(t => String(t.id) === String(req.params.id));
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  });

  // Root message (prevents Cannot GET /)
  app.get("/", (_req, res) => {
    res.send(`
      <h2>🚀 caBE Arena Backend is LIVE</h2>
      <p>API is running successfully.</p>
      <p>Environment: <b>${process.env.NODE_ENV || "development"}</b></p>
    `);
  });
}
