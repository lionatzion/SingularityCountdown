// Ultra-simple deployment server - NO complex logic, just work
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// ALWAYS respond to health checks first
app.get('/', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Try to serve static files if they exist
const publicPath = path.join(__dirname, 'server/public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Fallback for everything else
app.use((req, res) => {
  res.json({ message: 'Deployment server running', path: req.path });
});

// Start server - NO complex logic, just start
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Deployment server running on port ${PORT}`);
});

// Keep alive no matter what
process.on('uncaughtException', (err) => {
  console.error('Error caught:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Promise rejection:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});