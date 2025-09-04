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

# 2. Build the application
echo "🔧 Building application..."
npm run build

# 3. Ensure static files are in correct location
echo "📁 Setting up static files for production..."
mkdir -p server/public
if [ -d "dist/public" ]; then
    cp -r dist/public/* server/public/
    echo "✅ Static files copied to server/public"
else
    echo "⚠️  Warning: dist/public not found, static files may not be available"
fi

# 4. Verify health check endpoint will work
echo "🔍 Verifying production build..."
if [ -f "dist/index.js" ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi

# 5. Start the production server
echo "🌐 Starting production server..."
echo "💚 Health check available at /"
NODE_ENV=production exec node dist/index.js