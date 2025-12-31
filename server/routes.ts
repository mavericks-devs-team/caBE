import { Router } from "express";

import { mockTasks as MOCK_TASKS } from "./mockData.js";
import { getAllTasks, getTaskById, createTask } from "./storage.js";

export const api = Router();

/**
 * Health check
 */
api.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "caBE Arena API" });
});

/**
 * Get all tasks
 */
api.get("/tasks", async (_req, res) => {
  const tasks = await getAllTasks();
  res.json({
    ok: true,
    source: "storage",
    data: tasks ?? MOCK_TASKS
  });
});

/**
 * Get task by id
 */
api.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const task = await getTaskById(id);

  if (!task) {
    return res.status(404).json({
      ok: false,
      message: "Task not found"
    });
  }

  res.json({ ok: true, data: task });
});

/**
 * Create task
 */
api.post("/tasks", async (req, res) => {
  const body = req.body;

  const created = await createTask(body);

  res.status(201).json({
    ok: true,
    data: created
  });
});
