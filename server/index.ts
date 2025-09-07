
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";

const app = express();

// CRITICAL: Health check endpoints - dedicated paths for deployment health checks
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const isProduction = process.env.NODE_ENV === "production";
const port = parseInt(process.env.PORT || "5000", 10);

// Create server immediately
const server = createServer(app);

// Start server FIRST
server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port} (${isProduction ? 'production' : 'development'})`);
  
  // Only after server is listening, setup everything else
  setupApplication();
});

async function setupApplication() {
  try {
    // Import modules only after server is running
    const { registerRoutes } = await import("./routes");
    const { setupVite, serveStatic, log } = await import("./vite");
    const { migrate } = await import("./migrate");

    // Add logging middleware
    app.use((req, res, next) => {
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

    // Run database migration last
    migrate()
      .then(() => console.log("Database migration completed"))
      .catch(error => console.log(`Migration failed: ${error}`));

  } catch (error) {
    console.log(`Application setup failed: ${error}`);
  }
}

// Process handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => process.exit(0));
});

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
