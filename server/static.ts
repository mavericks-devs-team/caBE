import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve("client/dist");

  console.log("🔎 Static middleware attempting to serve:", distPath);

  if (!fs.existsSync(distPath)) {
    console.warn(`⚠️ No client build found at ${distPath}`);
    return;
  }

  // Serve static assets
  app.use(express.static(distPath));

  // Fallback to index.html for SPA routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  console.log("✅ Static files are being served from:", distPath);
}
