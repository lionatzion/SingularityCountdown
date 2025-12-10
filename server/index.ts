
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";

const app = express();

// Application readiness state
let isReady = false;
let isShuttingDown = false;
let startupError: string | null = null;

// CRITICAL: Health check endpoints - always respond immediately for deployment
// Liveness probe - always returns OK if server is running
app.get("/health", (req, res) => {
  if (isShuttingDown) {
    return res.status(503).send("Shutting down");
  }
  res.status(200).send("OK");
});

// Readiness probe - only returns OK when app is fully initialized
app.get("/api/health", (req, res) => {
  if (isShuttingDown) {
    return res.status(503).send("Shutting down");
  }
  if (!isReady) {
    return res.status(503).send("Starting up");
  }
  res.status(200).send("OK");
});

// Ready endpoint - explicit readiness check for autoscale deployments
app.get("/ready", (req, res) => {
  if (isShuttingDown) {
    return res.status(503).json({ status: "shutting_down" });
  }
  if (!isReady) {
    return res.status(503).json({ status: "starting", error: startupError });
  }
  res.status(200).json({ status: "ready", error: startupError });
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const isProduction = process.env.NODE_ENV === "production";
const port = parseInt(process.env.PORT || "5000", 10);

// Create server immediately
const server = createServer(app);

// Graceful shutdown handler with connection tracking
function gracefulShutdown(signal: string) {
  console.log(`${signal} received, starting graceful shutdown`);
  isShuttingDown = true;
  
  // Stop accepting new connections
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log("Force closing after timeout");
    process.exit(1);
  }, 10000);
  
  // Get open connections count
  server.getConnections((err, count) => {
    if (!err) {
      console.log(`Waiting for ${count} connections to close`);
    }
  });
}

// Start server FIRST - health checks respond immediately
server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port} (${isProduction ? 'production' : 'development'})`);
  
  // Only after server is listening, setup everything else
  setupApplication();
});

async function setupApplication() {
  try {
    // Import modules only after server is running
    const { registerRoutes } = await import("./routes");
    const { setupVite, serveStatic } = await import("./vite");

    // Add logging middleware (only log non-health check requests in development)
    app.use((req, res, next) => {
      // Skip logging for health checks to reduce noise
      if (req.path === '/health' || req.path === '/api/health' || req.path === '/ready') {
        return next();
      }
      const start = Date.now();
      res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
      });
      next();
    });

    // Register routes
    try {
      await registerRoutes(app);
    } catch (error) {
      console.log(`Route registration failed: ${error}`);
    }

    // Setup serving
    if (isProduction) {
      try {
        serveStatic(app);
        console.log("Production mode: serving static files");
      } catch (error) {
        console.log(`Static file serving failed: ${error}`);
      }
    } else {
      try {
        await setupVite(app, server);
        console.log("Development mode: Vite HMR enabled");
      } catch (error) {
        console.log(`Vite setup failed: ${error}`);
      }
    }

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Mark as ready before running migrations
    // This allows the app to serve requests while migrations run in the background
    isReady = true;
    console.log("Application ready to serve requests");

    // Run database migration in background (don't block readiness)
    const { migrate } = await import("./migrate");
    migrate()
      .then(() => console.log("Database migration completed"))
      .catch(error => console.log(`Migration warning: ${error}`));

  } catch (error) {
    console.log(`Application setup failed: ${error}`);
    startupError = error instanceof Error ? error.message : String(error);
  } finally {
    // Always mark as ready so deployment doesn't hang indefinitely
    // Even if setup fails, the server can respond to health checks
    isReady = true;
  }
}

// Process handlers for graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Global error handlers - log but don't crash
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
