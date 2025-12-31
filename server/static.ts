import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve("client/dist");

  if (!fs.existsSync(distPath)) {
    console.warn("⚠️ No client build found:", distPath);
    return;
  }

  console.log("📦 Serving frontend from:", distPath);

  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

