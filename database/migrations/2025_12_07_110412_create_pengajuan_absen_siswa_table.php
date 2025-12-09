<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan_absen_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_id')->constrained('jadwal_siswa');
            $table->foreignId('siswa_id')->constrained('siswa');
            $table->date('tanggal');
            $table->foreignId('status_id')->constrained('jenis_absen');
            $table->string('bukti')->nullable();
            $table->text('alasan')->nullable();
            $table->enum('status_pengajuan', ['DITERIMA','DITOLAK'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_absen_siswa');
    }
};