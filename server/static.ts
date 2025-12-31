import express, { Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve("client/dist");

  console.log("🔎 Static middleware attempting:", distPath);

  if (!fs.existsSync(distPath)) {
    console.warn("⚠️ No client build found — skipping static serve");
    return;
  }

  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  console.log("✅ Static frontend enabled");
}
