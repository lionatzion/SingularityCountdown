
import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { migrate } from "./migrate";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
  });

  next();
});

// CRITICAL: Root endpoint MUST return 200 immediately for deployment health checks
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const isProduction = process.env.NODE_ENV === "production";

async function startServer() {
  // Register routes first
  let server: Server;
  try {
    server = await registerRoutes(app);
  } catch (error) {
    log(`Route registration failed: ${error}`);
    server = createServer(app);
  }

  // Setup serving based on environment
  if (isProduction) {
    try {
      serveStatic(app);
      log("Production mode: serving static files");
    } catch (error) {
      log(`Static file serving failed: ${error}`);
    }
  } else {
    try {
      await setupVite(app, server);
      log("Development mode: Vite HMR enabled");
    } catch (error) {
      log(`Vite setup failed: ${error}`);
    }
  }

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  const port = parseInt(process.env.PORT || "5000", 10);

  // Start server immediately - don't wait for migrations
  server.listen(port, "0.0.0.0", () => {
    log(`Server running on http://0.0.0.0:${port} (${isProduction ? 'production' : 'development'})`);
    
    // Run database migration AFTER server starts to avoid blocking health checks
    migrate()
      .then(() => log("Database migration completed"))
      .catch(error => log(`Migration failed: ${error}`));
  });

  // Process handlers
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

  return server;
}

startServer().catch(error => {
  console.error('Server startup error:', error);
  process.exit(1);
});

// Global error handlers - NEVER let the server crash
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
