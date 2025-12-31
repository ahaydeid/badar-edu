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
        Schema::create('absen_jp_temporary', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('jadwal_id');
            $table->unsignedBigInteger('siswa_id');
            $table->time('jam_masuk');
            $table->date('tanggal');
            $table->smallInteger('terlambat')->nullable();
            $table->unsignedBigInteger('status_id');
            $table->enum('status_absen', ['SELESAI', 'BELUM'])->default('BELUM');
            $table->timestamps();

            $table->foreign('jadwal_id')->references('id')->on('jadwal');
            $table->foreign('siswa_id')->references('id')->on('siswa');
            $table->foreign('status_id')->references('id')->on('jenis_absen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absen_jp_temporary');
    }
};
