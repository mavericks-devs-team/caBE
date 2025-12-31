import { Express } from "express";
import { MOCK_TASKS } from "./mockData.js";
import { getAllTasks, getTaskById, createTask } from "./storage.js";

export function registerRoutes(app: Express) {

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/tasks", (_req, res) => {
    res.json(getAllTasks() ?? MOCK_TASKS);
  });

  app.get("/api/tasks/:id", (req, res) => {
    const task = getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: "Not found" });
    res.json(task);
  });

  app.post("/api/tasks", (req, res) => {
    const task = createTask(req.body);
    res.json(task);
  });
}
