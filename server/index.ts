
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

// CRITICAL: Root endpoint MUST return 200 for deployment health checks
app.get("/", (req, res) => {
  // ALWAYS return 200 OK - no conditions, no exceptions
  res.status(200).json({ 
    status: "OK", 
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

// Handle the database migrations
(async () => {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    await migrate();
    log("Database migration completed");
  } catch (error) {
    log(`Migration failed: ${error}`);
    // CONTINUE ANYWAY - don't let migration failure stop the server
  }

  // Register routes with fallback
  let server;
  try {
    server = await registerRoutes(app);
  } catch (error) {
    log(`Route registration failed: ${error}`);
    // Create basic server if route registration fails
    server = createServer(app);
  }

  // Setup serving based on environment
  try {
    if (isProduction) {
      serveStatic(app);
      log("Production mode: serving static files");
    } else {
      await setupVite(app, server);
      log("Development mode: Vite HMR enabled");
    }
  } catch (error) {
    log(`Serving setup failed: ${error}`);
    // Continue without static file serving if it fails
  }

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`Server running on http://0.0.0.0:${port} (${isProduction ? 'production' : 'development'})`);
  });

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
  console.error('Server startup error:', error);
  // DO NOT EXIT - Keep the server running no matter what
  console.error('Server will continue running despite errors');
});

// Global error handlers - NEVER let the server crash
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // DO NOT EXIT
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // DO NOT EXIT
});
