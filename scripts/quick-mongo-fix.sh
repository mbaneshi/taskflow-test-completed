#!/bin/bash

# Quick MongoDB Connection Fix for Orbstack
# This script quickly restarts MongoDB and fixes common networking issues

echo "🔧 Quick MongoDB Fix for Orbstack"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Stop all containers
echo "⏹️  Stopping all containers..."
docker-compose down

# Clean up networks
echo "🧹 Cleaning up networks..."
docker network prune -f

# Wait a moment
sleep 2

# Start MongoDB first
echo "🚀 Starting MongoDB..."
docker-compose up -d mongodb

# Wait for MongoDB to be healthy
echo "⏳ Waiting for MongoDB to be healthy..."
attempts=0
max_attempts=30

while [ $attempts -lt $max_attempts ]; do
    if docker-compose ps mongodb | grep -q "healthy"; then
        echo "✅ MongoDB is healthy!"
        break
    fi
    
    attempts=$((attempts + 1))
    echo -n "⏳ Waiting... ($attempts/$max_attempts)"
    sleep 2
    echo -ne "\r"
done

if [ $attempts -eq $max_attempts ]; then
    echo "❌ MongoDB did not become healthy in time"
    exit 1
fi

# Start other services
echo "🚀 Starting other services..."
docker-compose up -d

# Test connection
echo "🧪 Testing connection..."
sleep 5

if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Connection test successful!"
    echo ""
    echo "🎉 MongoDB connection issues should be resolved!"
    echo ""
    echo "💡 To prevent future issues:"
    echo "   1. Always use 'docker-compose up -d' to start services"
    echo "   2. Wait for containers to be healthy before starting your app"
    echo "   3. If issues persist, run this script again"
else
    echo "❌ Connection test failed"
    echo "💡 Try running the full diagnostic script: npm run fix:mongo"
fi
