<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absen_jp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_id')->constrained('jadwal');
            $table->foreignId('siswa_id')->constrained('siswa');
            $table->date('tanggal');
            $table->tinyInteger('bulan');
            $table->foreignId('semester_id')->constrained('semester');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absen_jp');
    }
};