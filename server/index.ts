import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { registerRoutes } from "./routes.js";

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- API Routes ----------
registerRoutes(app);

// ---------- Static Frontend Serving ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// client/dist after Vite build
const clientBuildPath = path.join(__dirname, "..", "client", "dist");

console.log("🔎 Static middleware serving:", clientBuildPath);

app.use(express.static(clientBuildPath));

// React Router fallback
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ---------- Server Startup ----------
const PORT = Number(process.env.PORT) || 10000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
});
