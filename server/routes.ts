import { Express } from "express";
import { Server } from "http";

import { getAllTasks, getTaskById, createTask } from "./storage.js";
import { mockTasks } from "./mockData.js";
import { routes } from "../shared/routes.js";
import { ApiResponse } from "../shared/models.js";

export async function registerRoutes(_http: Server, app: Express) {
  console.log("🔧 Registering API routes...");

  // --- HEALTH CHECK ---
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "backend" });
  });

  // --- GET ALL TASKS ---
  app.get(routes.tasks.list, async (_req, res) => {
    const data = await getAllTasks();
    const response: ApiResponse = { success: true, data };
    res.json(response);
  });

  // --- GET TASK BY ID ---
  app.get(routes.tasks.get, async (req, res) => {
    const id = req.params.id;
    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const response: ApiResponse = { success: true, data: task };
    res.json(response);
  });

  // --- CREATE TASK ---
  app.post(routes.tasks.create, async (req, res) => {
    const payload = req.body;

    const task = await createTask(payload);
    const response: ApiResponse = { success: true, data: task };

    res.json(response);
  });

  // --- MOCK FALLBACK (if DB OFF) ---
  app.get("/api/mock/tasks", (_req, res) => {
    res.json({ success: true, data: mockTasks });
  });

  console.log("✅ API routes registered");
}
