import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Resolve dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Load routes dynamically (avoids ESM path issues)
async function loadRoutes() {
  const routesPath = path.join(__dirname, "routes.js");
  const mod = await import(routesPath);
  return mod.registerRoutes;
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    }
  })
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formatted = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formatted} [${source}] ${message}`);
}

// Log API traffic
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let payload: any;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    payload = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const ms = Date.now() - start;
      let line = `${req.method} ${path} ${res.statusCode} in ${ms}ms`;
      if (payload) line += ` :: ${JSON.stringify(payload)}`;
      log(line);
    }
  });

  next();
});

(async () => {
  try {
    // Register API routes
    const registerRoutes = await loadRoutes();
    await registerRoutes(httpServer, app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("[API ERROR]", err);
      res.status(err.status || 500).json({ message: err.message ?? "Error" });
    });

    // Serve frontend in production
    if (process.env.NODE_ENV === "production") {
      const distDir = path.join(__dirname, "../client/dist");

      console.log("🔎 Checking static path:", distDir);

      if (fs.existsSync(distDir)) {
        app.use(express.static(distDir));
        app.get("*", (_req, res) =>
          res.sendFile(path.join(distDir, "index.html"))
        );
        console.log("✅ Static frontend enabled");
      } else {
        console.warn("⚠️ client build missing — API only mode");
      }
    } else {
      const { setupVite } = await import("./vite.js");
      await setupVite(httpServer, app);
    }

    // Required for Render
    const port = parseInt(process.env.PORT || "5000", 10);

    httpServer.listen(port, "0.0.0.0", () => {
      log(`🚀 Server running on 0.0.0.0:${port}`);
    });
  } catch (err) {
    console.error("❌ FATAL STARTUP ERROR", err);
  }
})();
