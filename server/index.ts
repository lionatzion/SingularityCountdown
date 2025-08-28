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
  const isProduction = process.env.NODE_ENV === "production";
  
  // Set Express environment
  app.set("env", isProduction ? "production" : "development");

  // Add health check endpoint for API status
  app.get("/api/health", (req, res) => {
    res.status(200).json({ 
      status: "OK", 
      message: "AI Singularity Tracker API is running",
      timestamp: new Date().toISOString(),
      environment: isProduction ? "production" : "development"
    });
  });

  // Run migrations in both dev and production
  try {
    await migrate();
    log("Database migration completed");
  } catch (error) {
    log(`Migration failed: ${error}`);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Setup serving based on environment
  if (isProduction) {
    serveStatic(app);
    log("Production mode: serving static files");
  } else {
    await setupVite(app, server);
    log("Development mode: Vite HMR enabled");
  }

  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`Server running on http://0.0.0.0:${port} (${isProduction ? 'production' : 'development'})`);
  });

  // Keep the process alive
  process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    log('SIGINT received, shutting down gracefully');
    server.close(() => {
      process.exit(0);
    });
  });
})().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});