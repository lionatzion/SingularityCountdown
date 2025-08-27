import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { migrate } from "./migrate";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        // Truncate the JSON response to avoid excessively long log lines
        const jsonString = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${jsonString.length > 80 ? jsonString.substring(0, 77) + "…" : jsonString}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Run migrations on startup to ensure database tables exist
  try {
    await migrate();
  } catch (error) {
    // Log the error but allow the server to continue if migration fails
    log(`Migration failed, but continuing startup: ${error}`);
  }

  // Add health check endpoint before other routes
  app.get("/", (req, res) => {
    res.status(200).json({ 
      status: "OK", 
      message: "AI Singularity Tracker API is running",
      timestamp: new Date().toISOString()
    });
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    // Re-throwing the error might be necessary for other error handlers,
    // but for a simple express server, it might cause unhandled rejection.
    // Consider carefully if this re-throw is needed.
    // throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();