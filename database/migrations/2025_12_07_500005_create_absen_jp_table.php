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
        Schema::create('absen_jp', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('jadwal_id');
            $table->unsignedBigInteger('siswa_id');
            $table->date('tanggal');
            $table->tinyInteger('bulan');
            $table->unsignedBigInteger('semester_id');
            $table->timestamps();

            $table->foreign('jadwal_id')->references('id')->on('jadwal');
            $table->foreign('siswa_id')->references('id')->on('siswa');
            $table->foreign('semester_id')->references('id')->on('semester');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absen_jp');
    }
};
