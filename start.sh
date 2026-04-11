#!/bin/bash

# Resumate AI - Docker Quick Start

set -e  # Exit on error

echo "🚀 Starting Resumate AI with Docker..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env with GEMINI_API_KEY"
    exit 1
fi

# Check if backend .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  backend/.env not found, copying from root .env"
    cp .env backend/.env
fi

# Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull origin main || true

# Build images
echo "🔨 Building Docker images..."
docker-compose build --pull

# Start services
echo "🎬 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check status
echo ""
echo "✅ Resumate AI is running!"
echo ""
docker-compose ps
echo ""
echo "📊 URLs:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:5000/api"
echo "  Nginx:     http://localhost"
echo ""
echo "📋 Commands:"
echo "  View logs:     docker-compose logs -f"
echo "  View backend:  docker-compose logs -f backend"
echo "  Restart:       docker-compose restart"
echo "  Stop:          docker-compose down"
