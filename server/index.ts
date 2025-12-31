import express from "express";
import cors from "cors";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {

  // Register API routes (takes ONLY app now)
  await registerRoutes(app);

  // Serve frontend in production
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || 5000);

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on 0.0.0.0:${port}`);
  });

})();
