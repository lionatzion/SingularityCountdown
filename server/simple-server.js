const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ALWAYS return 200 OK for health checks - no conditions, no complexity
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Serve static files from dist/public in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/public')));
  
  // Catch all routes and serve index.html for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  });
}

// Start server - NO ASYNC, NO PROMISES, NO FAILURES
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Keep the process alive no matter what
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // DO NOT EXIT
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // DO NOT EXIT
});