#!/bin/bash

# Configuration
PROJECT_DIR="~/badu"
REGISTRY="ghcr.io"
IMAGE_NAME="ghcr.io/ahaydeid/badar-edu/app:latest"

echo "🚀 Starting automated deployment..."

# Update local repository
echo "📥 Pulling latest code changes..."
git pull origin main

# Pull the latest image
echo "📥 Pulling latest Docker image..."
docker pull $IMAGE_NAME

# Restart containers
echo "🏗️ Restarting containers..."
docker compose up -d

# Clean up old images
echo "🧹 Cleaning up old images..."
docker image prune -f

# Laravel maintenance
echo "📦 Running Laravel maintenance..."
docker exec badu_app php artisan migrate --force
docker exec badu_app php artisan config:cache
docker exec badu_app php artisan route:cache
docker exec badu_app php artisan view:cache

# Set permissions
echo "🔐 Setting permissions..."
docker exec badu_app chown -R www-data:www-data storage bootstrap/cache
docker exec badu_app chmod -R 775 storage bootstrap/cache

echo "✅ Deployment successful!"
