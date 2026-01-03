#!/bin/bash

# Fungsi untuk membersihkan proses saat skrip dihentikan (Ctrl+C)
cleanup() {
    echo ""
    echo "🛑 Menghentikan lingkungan pengembangan..."
    pkill -P $$
    exit
}

trap cleanup SIGINT SIGTERM

echo "🚀 Memulai lingkungan pengembangan..."

# 1. Pastikan proses lama sudah benar-benar mati
pkill -f "php artisan serve" > /dev/null 2>&1
pkill -f "vite" > /dev/null 2>&1

# 2. Menjalankan XAMPP (memerlukan password sudo)
sudo /opt/lampp/lampp start

# 3. Menjalankan PHP Artisan Serve di background
php artisan serve &

# 4. Menjalankan NPM Run Dev
npm run dev
