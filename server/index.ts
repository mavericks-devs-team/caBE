import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { registerRoutes } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ---- API ROUTES ----
registerRoutes(app);

// ---- STATIC FRONTEND (Production) ----
const clientDist = path.join(__dirname, "../client/dist");
console.log("Serving static from:", clientDist);

app.use(express.static(clientDist));

// Catch root request -> send frontend
app.get("/", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// Catch all client routes (React Router etc.)
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on ${port}`);
});
