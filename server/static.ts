import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve("client/dist");

  // If the frontend hasn't been built, DON'T crash the server
  if (!fs.existsSync(distPath)) {
    console.warn(
      `⚠️ Skipping static serve — build folder not found at: ${distPath}`
    );
    return;
  }

  console.log(`📦 Serving frontend from: ${distPath}`);

  app.use(express.static(distPath));

  // Fallback: always return index.html for SPA routes
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

