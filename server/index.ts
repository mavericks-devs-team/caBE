import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const candidates = [
    "client/dist",
    "client/build",
    "dist",
    "public"
  ];

  let foundPath: string | null = null;

  for (const p of candidates) {
    const full = path.resolve(p);
    console.log("🔎 Checking for frontend at:", full);

    if (fs.existsSync(full)) {
      foundPath = full;
      break;
    }
  }

  if (!foundPath) {
    console.log("❌ No frontend build found in any known paths");
    return;
  }

  console.log("📦 Serving frontend from:", foundPath);

  app.use(express.static(foundPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(foundPath!, "index.html"));
  });
}
