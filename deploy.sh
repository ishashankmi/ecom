#!/bin/bash

echo "🚀 Starting Saras deployment..."

# Stop existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Remove old images
echo "🗑️ Removing old images..."
docker rmi saras-frontend saras-backend saras-postgres 2>/dev/null || true

# Build and start all services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Show container status
echo "📊 Container status:"
docker ps

echo "✅ Deployment complete! App running at http://localhost"