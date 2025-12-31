import express, { type Express } from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: Express) {
  const distPath = path.resolve("client/dist");

  console.log("🔎 Static middleware attempting to serve:", distPath);

  if (!fs.existsSync(distPath)) {
    console.warn("⚠️ No client build found:", distPath);
    return;
  }

  app.use(express.static(distPath));

  // Fallback to index.html for SPA routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  console.log("✅ Static frontend enabled");
}
