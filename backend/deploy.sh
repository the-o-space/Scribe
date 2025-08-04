#!/bin/bash

# Scribe Backend Deployment Script
# This script helps deploy the backend to a production server

set -e

echo "🚀 Scribe Backend Deployment"
echo "================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env from .env.example and configure it"
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ Error: PM2 is not installed!"
    echo "Install with: sudo npm install -g pm2"
    exit 1
fi

# Install/update dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Stop existing PM2 process if running
echo "🛑 Stopping existing process..."
pm2 stop scribe-backend 2>/dev/null || true

# Start the application
echo "🚀 Starting application..."
pm2 start src/app.js --name scribe-backend --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Show status
echo "📊 Application status:"
pm2 status scribe-backend

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Useful commands:"
echo "- View logs: pm2 logs scribe-backend"
echo "- Restart: pm2 restart scribe-backend"
echo "- Stop: pm2 stop scribe-backend"
echo "- Monitor: pm2 monit"
echo ""
echo "Don't forget to:"
echo "1. Set up Nginx reverse proxy with SSL"
echo "2. Configure firewall rules"
echo "3. Test the /api/health endpoint"
echo "4. Verify SendGrid configuration"