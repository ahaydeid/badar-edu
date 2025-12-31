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
        Schema::create('pengajuan_absen_siswa', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('jadwal_id');
            $table->unsignedBigInteger('siswa_id');
            $table->date('tanggal');
            $table->unsignedBigInteger('status_id');
            $table->string('bukti')->nullable();
            $table->text('alasan')->nullable();
            $table->enum('status_pengajuan', ['DITERIMA', 'DITOLAK'])->nullable();
            $table->timestamps();

            $table->foreign('jadwal_id')->references('id')->on('jadwal_siswa');
            $table->foreign('siswa_id')->references('id')->on('siswa');
            $table->foreign('status_id')->references('id')->on('jenis_absen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengajuan_absen_siswa');
    }
};
