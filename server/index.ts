import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// ---------------- API ROUTES ----------------
registerRoutes(app);

// ---------------- STATIC FRONTEND ----------------

// Absolute path to client build
const clientDist = path.join(__dirname, "../client/dist");

console.log("🔎 Static middleware serving:", clientDist);

app.use(express.static(clientDist));

// Fallback → SPA index.html
app.get("*", (req, res) => {
  const indexPath = path.join(clientDist, "index.html");
  console.log("➡️ Fallback to:", indexPath);
  res.sendFile(indexPath);
});

// ---------------- SERVER START ----------------
const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
});
