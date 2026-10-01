import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiRouter from "./server/routes/api";

process.on("uncaughtException", (err) => {
  console.error("[CRITICAL] Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[CRITICAL] Unhandled promise rejection:", reason);
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

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

  // Core Health Check routes (required by container ingress and control-plane)
  app.get(["/api/health", "/health"], (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
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
    app.get("*all", (req, res) => {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
