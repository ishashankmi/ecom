#!/bin/bash

echo "🚀 Creating and running containers..."

# Create network
echo "🌐 Creating network..."
docker network create saras-network 2>/dev/null || true

# Run PostgreSQL container
echo "📦 Starting PostgreSQL container..."
docker run -d \
  --name saras-postgres \
  --network saras-network \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  saras-postgres

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
sleep 10

# Run Backend container
echo "🔧 Starting Backend container..."
docker run -d \
  --name saras-backend \
  --network saras-network \
  -p 3002:3002 \
  -e PORT=3002 \
  -e DB_HOST=saras-postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=mydb \
  -e DB_USER=myuser \
  -e DB_PASSWORD=mypassword \
  -e JWT_SECRET=your-super-secret-jwt-key-here \
  saras-backend

# Run Frontend container
echo "🎨 Starting Frontend container..."
docker run -d \
  --name saras-frontend \
  --network saras-network \
  -p 3000:3000 \
  -e VITE_API_URL=/api \
  saras-frontend

# Run Nginx container
echo "🌐 Starting Nginx container..."
docker run -d \
  --name saras-nginx \
  --network saras-network \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx:alpine

echo "✅ All containers started!"

# Show running containers
echo "📊 Running containers:"
docker ps