#!/bin/bash

# Production deployment script for AI Singularity Tracker
# Implements fixes for deployment health check issues

echo "🚀 Starting production deployment process..."

# Set production environment immediately
export NODE_ENV=production

# 0. Stop any running development servers
echo "⏹️  Stopping development servers..."
pkill -f "tsx server/index.ts" || true
sleep 2

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm ci

# 2. Build the application with production environment
echo "🔧 Building application..."
NODE_ENV=production vite build
NODE_ENV=production esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# 3. Ensure static files are in correct location for production
echo "📁 Setting up static files for production..."
mkdir -p server/public
if [ -d "dist/public" ]; then
    cp -r dist/public/* server/public/
    echo "✅ Static files copied to server/public"
else
    echo "⚠️  Warning: dist/public not found, static files may not be available"
fi

# 4. Verify production build
echo "🔍 Verifying production build..."
if [ -f "dist/index.js" ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi

# 5. Test health check endpoint locally
echo "🔍 Testing health check before deployment..."
NODE_ENV=production node dist/index.js &
SERVER_PID=$!
sleep 3

# Test health check
if curl -f -s http://localhost:5000/health > /dev/null; then
    echo "✅ Health check endpoint working"
else
    echo "❌ Health check endpoint failed"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

kill $SERVER_PID 2>/dev/null || true
sleep 1

# 6. Start the production server
echo "🌐 Starting production server..."
echo "💚 Health check available at /"
NODE_ENV=production exec node dist/index.js