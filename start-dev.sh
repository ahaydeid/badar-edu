#!/bin/bash

echo "🚀 Memulai lingkungan pengembangan..."

# 1. Menjalankan XAMPP (memerlukan password sudo)
sudo /opt/lampp/lampp start

# 2. Menjalankan PHP Artisan Serve di background
php artisan serve &

# 3. Menjalankan NPM Run Dev
npm run dev

# Catatan: Perintah terakhir (npm run dev) dibiarkan di foreground 
# agar Anda bisa melihat log-nya.
