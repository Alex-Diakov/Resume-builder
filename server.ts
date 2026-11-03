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
  const PORT = 3000;

  // Security header hardening (OWASP recommendations)
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
  });

  // Architectural optimization: Increased JSON parser capability safeguards backend from large nested state payloads.
  app.use(express.json({ limit: "15mb" }));

  // In-memory sliding rate limiter protecting API routes from concurrent traffic spikes / DDoS
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  const MAX_REQUESTS_PER_WINDOW = 120; // 120 requests/minute per client IP

  app.use("/api", (req, res, next) => {
    // Exclude healthcheck from rate limiting
    if (req.path === "/health") return next();

    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip || "127.0.0.1";
    const now = Date.now();
    const clientData = rateLimitMap.get(clientIp);

    if (!clientData || now > clientData.resetTime) {
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      return next();
    }

    clientData.count++;
    if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Traffic threshold exceeded. Please retry in a few seconds."
      });
    }

    next();
  });

  // Custom high-fidelity performance & traffic tracing middleware 
  app.use((req, res, next) => {
    const startMs = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - startMs;
      if (res.statusCode >= 400 || duration > 1000) {
        console.log(`[HTTP TRACE] ${req.method} ${req.originalUrl} -> Status: ${res.statusCode} in ${duration}ms`);
      }
    });
    next();
  });

  // Core Health Check routes (required by container ingress and control-plane)
  app.get(["/api/health", "/health"], (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mount API modular routes
  app.use("/api", apiRouter);

  // Serve static assets in production with caching, otherwise mount Vite in development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { maxAge: "1d", etag: true }));
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
