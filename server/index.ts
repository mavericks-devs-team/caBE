import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";

import { registerRoutes } from "./routes.js";  // <-- IMPORTANT
import { serveStatic } from "./static.js";    // <-- IMPORTANT


const app = express();
const httpServer = createServer(app);

// Capture raw webhooks safely
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);

app.use(express.urlencoded({ extended: false }));

// ---- Small logging helper ----
export function log(message: string, source = "express") {
  const t = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });
  console.log(`${t} [${source}] ${message}`);
}

// ---- API request logger ----
app.use((req, res, next) => {
  const start = Date.now();
  const original = res.json;

  let jsonBody: any;

  res.json = function (body, ...args) {
    jsonBody = body;
    return original.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const ms = Date.now() - start;
      let msg = `${req.method} ${req.path} ${res.statusCode} in ${ms}ms`;
      if (jsonBody) msg += ` :: ${JSON.stringify(jsonBody)}`;
      log(msg);
    }
  });

  next();
});

// ---- MAIN BOOTSTRAP ----
(async () => {
  // Register API routes first
  await registerRoutes(httpServer, app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
    throw err;
  });

  // ---- PRODUCTION: serve built frontend ----
  if (process.env.NODE_ENV === "production") {
    log("🌐 Production mode — enabling static frontend", "server");
    serveStatic(app);
  }

  // ---- DEVELOPMENT: Vite dev server ----
  else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ---- RENDER REQUIREMENTS ----
  const port = parseInt(process.env.PORT || "5000", 10);

  httpServer.listen(port, "0.0.0.0", () => {
    log(`🚀 Server running on 0.0.0.0:${port}`);
  });
})();
