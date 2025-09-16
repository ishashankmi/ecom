#!/bin/bash

echo "🚀 Building all Docker images..."

# Build PostgreSQL image
echo "📦 Building PostgreSQL image..."
docker build -t saras-postgres ./postgres

# Build Backend image
echo "🔧 Building Backend image..."
docker build -t saras-backend ./backend

# Build Frontend image
echo "🎨 Building Frontend image..."
docker build -t saras-frontend .

echo "✅ All images built successfully!"

# Show built images
echo "📊 Built images:"
docker images | grep saras