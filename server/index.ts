import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { serveStatic } from "./static";
import { createServer } from "http";
import fs from "fs";
import path from "path";

const distServerPath = path.resolve("dist/server");
if (fs.existsSync(distServerPath)) {
  console.log("📂 DIST SERVER CONTENTS:", fs.readdirSync(distServerPath));
} else {
  console.log("⚠️ dist/server does NOT exist");
}

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// API request logger
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let captured: any = undefined;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    captured = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const duration = Date.now() - start;
      let msg = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (captured) msg += ` :: ${JSON.stringify(captured)}`;
      log(msg);
    }
  });

  next();
});

(async () => {
  try {
    // ---- Register API routes ----
    await registerRoutes(httpServer, app);

    // ---- Global error handler ----
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("[API ERROR]", err);
      res.status(status).json({ message });
    });

    // ---- Serve Frontend in Production ----
    if (process.env.NODE_ENV === "production") {
      try {
        console.log("🔎 Static middleware checking for client build…");
        serveStatic(app);
        console.log("✅ Static frontend enabled");
      } catch (e) {
        console.warn("⚠️ No client build found — API only mode");
      }
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    // ---- Render Hosting Requirements ----
    const port = parseInt(process.env.PORT || "5000", 10);

    httpServer.listen(port, "0.0.0.0", () => {
      log(`🚀 Server running on 0.0.0.0:${port}`);
    });

  } catch (err) {
    console.error("❌ FATAL STARTUP ERROR", err);
  }
})();
