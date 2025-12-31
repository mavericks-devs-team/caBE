import { Express, Request, Response } from "express";

// 👇 IMPORTANT — include `.js` extensions for ESM runtime after build
import { MOCK_TASKS } from "./mockData.js";
import {
  getAllTasks,
  getTaskById,
  createTask,
} from "./storage.js";

export async function registerRoutes(app: Express) {
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      ok: true,
      service: "caBE Arena API",
      env: process.env.NODE_ENV || "development",
    });
  });

  // ===== TASK ROUTES =====

  // Get all tasks
  app.get("/api/tasks", async (_req: Request, res: Response) => {
    const tasks = await getAllTasks();
    res.json(tasks ?? MOCK_TASKS);
  });

  // Get task by id
  app.get("/api/tasks/:id", async (req: Request, res: Response) => {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  });

  // Create task
  app.post("/api/tasks", async (req: Request, res: Response) => {
    const task = await createTask(req.body);
    res.status(201).json(task);
  });

  // ===== FALLBACK API 404 =====
  app.all("/api/*", (_req: Request, res: Response) => {
    res.status(404).json({ message: "API route not found" });
  });
}
