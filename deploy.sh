#!/bin/bash

# Deployment script for AI Singularity Tracker

echo "Starting deployment process..."

# 0. Stop any running development servers
echo "Stopping development servers..."
pkill -f "tsx server/index.ts" || true
sleep 2

# 1. Install dependencies
echo "Installing dependencies..."
npm ci

# 2. Build the application
echo "Building application..."
npm run build

# 3. Copy built files to where server expects them
echo "Copying build files to server directory..."
cp -r dist/public server/

# 4. Start the production server
echo "Starting production server..."
NODE_ENV=production exec node dist/index.js