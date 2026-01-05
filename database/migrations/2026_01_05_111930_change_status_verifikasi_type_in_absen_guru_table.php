<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('absen_guru', function (Blueprint $table) {
            $table->enum('status_verifikasi', ['OTOMATIS', 'PENDING', 'DISETUJUI', 'DITOLAK'])->default('OTOMATIS')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('absen_guru', function (Blueprint $table) {
            $table->enum('status_verifikasi', ['OTOMATIS', 'PENDING', 'DISETUJUI', 'DITOLAK'])->default('OTOMATIS')->change();
        });
    }
};
