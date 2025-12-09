<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absen_jp_temporary', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_id')->constrained('jadwal');
            $table->foreignId('siswa_id')->constrained('siswa');
            $table->time('jam_masuk');
            $table->date('tanggal');
            $table->smallInteger('terlambat')->nullable();
            $table->foreignId('status_id')->constrained('jenis_absen');
            $table->enum('status_absen', ['SELESAI','BELUM'])->default('BELUM');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absen_jp_temporary');
    }
};