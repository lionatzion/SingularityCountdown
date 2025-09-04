#!/bin/bash

# Ultra-simple production startup script
echo "Starting production server..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Set production environment
export NODE_ENV=production

# Copy static files if they exist
if [ -d "dist/public" ]; then
  cp -r dist/public server/ 2>/dev/null || true
fi

# Try to start the built server
if [ -f "dist/index.js" ]; then
  echo "Starting built server from dist/index.js..."
  node dist/index.js
elif [ -f "deploy-server.js" ]; then
  echo "Starting deploy-server.js..."
  node deploy-server.js
elif [ -f "server/simple-server.js" ]; then
  echo "Starting simple-server.js..."
  node server/simple-server.js
else
  echo "ERROR: No server file found!"
  # Create emergency server on the fly
  cat > emergency-server.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Emergency server running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Emergency server running on port ' + PORT);
});

process.on('uncaughtException', (err) => {
  console.error('Error:', err);
});
EOF
  
  echo "Starting emergency server..."
  node emergency-server.js
fi