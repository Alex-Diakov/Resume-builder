import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiRouter from "./server/routes/api";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Architectural optimization: Increased JSON parser capability safeguards backend from large nested state payloads.
  app.use(express.json({ limit: "15mb" }));

  // Custom high-fidelity performance & traffic tracing middleware 
  app.use((req, res, next) => {
    const startMs = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - startMs;
      console.log(`[HTTP TRACE] ${req.method} ${req.originalUrl} -> Status: ${res.statusCode} in ${duration}ms`);
    });
    next();
  });

  // Mount API modular routes
  app.use("/api", apiRouter);

  // Serve static assets in production, otherwise mount Vite in development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("/*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Graceful Global Error-Handling Middleware prevents Express process from dropping unexpectedly
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(`[CRITICAL-API-ERROR] Unexpected execution failure on route ${req.originalUrl}:`, err);
    res.status(500).json({ 
      error: "An internal system incident occurred.",
      details: process.env.NODE_ENV !== "production" ? err.message : undefined
    });
  });

  const serverInstance = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express microservices running robustly on http://0.0.0.0:${PORT}`);
  });

  // Clean Termination Signal Listeners to handle cloud auto-scaling shutdowns gracefully
  const initiateGracefulShutdown = (signal: string) => {
    console.log(`[SHUTDOWN] Received ${signal}. Draining connections for seamless handover...`);
    serverInstance.close(() => {
      console.log("[SHUTDOWN] HTTP service successfully drained. Downscaling finalized safely.");
      process.exit(0);
    });
    
    // Safety timeout to force immediate shutdown if draining hangs
    setTimeout(() => {
      console.warn("[SHUTDOWN] Draining timed out. Terminating immediately.");
      process.exit(1);
    }, 5000);
  };

  process.on("SIGTERM", () => initiateGracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => initiateGracefulShutdown("SIGINT"));
}

startServer();
