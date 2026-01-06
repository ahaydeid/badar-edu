#!/bin/bash

# Pull the latest changes from GitHub
echo "📥 Pulling latest changes..."
if ! git pull origin main; then
    echo "❌ Failed to pull changes. Please check Git status."
    exit 1
fi

# Build and restart the containers
echo "🏗️ Building and restarting containers..."
docker-compose up -d --build

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
docker exec badu_app composer install --no-dev --optimize-autoloader

# Run database migrations
echo "🗄️ Running database migrations..."
docker exec badu_app php artisan migrate --force

# Optimize Laravel cache
echo "⚡ Optimizing Laravel..."
docker exec badu_app php artisan config:cache
docker exec badu_app php artisan route:cache
docker exec badu_app php artisan view:cache

# Build frontend assets using a temporary node container
# DISABLED: Build locally instead! Run `npm run build` before pushing to Git
# echo "🎨 Building frontend assets..."
# docker run --rm -v $(pwd):/var/www -w /var/www node:20-alpine sh -c "npm install && npm run build"

# Set permissions for storage & bootstrap/cache
echo "🔐 Setting permissions..."
docker exec badu_app chown -R www-data:www-data storage bootstrap/cache
docker exec badu_app chmod -R 775 storage bootstrap/cache

echo "✅ Deployment completed successfully! Jangan lupa cek Nginx Proxy Manager jika Anda mengganti nama container atau domain."
