<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pendaftars', function (Blueprint $table) {
            DB::statement("ALTER TABLE pendaftars MODIFY COLUMN status ENUM('Menunggu Verifikasi', 'Perlu Perbaikan', 'Terverifikasi', 'Diterima', 'Cadangan', 'Ditolak', 'Daftar Ulang', 'Siswa Baru', 'Migrasi Selesai') DEFAULT 'Menunggu Verifikasi'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftars', function (Blueprint $table) {
            DB::statement("ALTER TABLE pendaftars MODIFY COLUMN status ENUM('Menunggu Verifikasi', 'Perlu Perbaikan', 'Terverifikasi', 'Diterima', 'Cadangan', 'Ditolak', 'Daftar Ulang', 'Siswa Baru') DEFAULT 'Menunggu Verifikasi'");
        });
    }
};
