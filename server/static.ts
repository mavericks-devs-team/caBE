import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  try {
    const candidates = [
      "client/dist",
      "client/build",
      "client/public",
      "dist",
      "build",
      "public"
    ];

    let found: string | null = null;

    for (const p of candidates) {
      const full = path.resolve(p);
      console.log("🔎 Checking:", full);

      if (fs.existsSync(full)) {
        found = full;
        break;
      }
    }

    if (!found) {
      console.log("❌ No frontend build found — skipping static serve");
      return;
    }

    console.log("📦 Serving frontend from:", found);

    app.use(express.static(found));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(found!, "index.html"));
    });

  } catch (err) {
    console.error("💥 Static serve failed:", err);
  }
}
