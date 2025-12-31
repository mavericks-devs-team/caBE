import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { createServer } from "http";
import { registerRoutes } from "./routes.js";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody?: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(cors());

export function log(message: string, source = "express") {
  const formattedTime = new Date().toISOString();
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any;

  const originalJson = res.json;
  res.json = function (body: any) {
    capturedJsonResponse = body;
    return originalJson.call(this, body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let msg = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) msg += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      log(msg);
    }
  });

  next();
});

(async () => {
  registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    log(`❌ ${message}`, "error");
  });

  // Static serve only in production if client build exists
  if (process.env.NODE_ENV === "production") {
    import("./static.js").then(({ serveSta
