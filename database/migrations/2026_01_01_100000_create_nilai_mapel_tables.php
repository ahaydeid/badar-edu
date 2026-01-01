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
        Schema::create('jenis_penilaian', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('guru_id');
            $table->unsignedBigInteger('kelas_id');
            $table->unsignedBigInteger('mapel_id');
            $table->unsignedBigInteger('semester_id');
            $table->string('nama');
            $table->timestamps();

            $table->foreign('guru_id')->references('id')->on('guru')->onDelete('cascade');
            $table->foreign('kelas_id')->references('id')->on('kelas')->onDelete('cascade');
            $table->foreign('mapel_id')->references('id')->on('mapel')->onDelete('cascade');
            $table->foreign('semester_id')->references('id')->on('semester')->onDelete('cascade');
        });

        Schema::create('sub_penilaian', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('jenis_penilaian_id');
            $table->string('nama');
            $table->enum('status', ['proses', 'selesai'])->default('proses');
            $table->timestamps();

            $table->foreign('jenis_penilaian_id')->references('id')->on('jenis_penilaian')->onDelete('cascade');
        });

        Schema::create('nilai_siswa', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sub_penilaian_id');
            $table->unsignedBigInteger('siswa_id');
            $table->decimal('nilai', 5, 2); // Supports 100.00
            $table->timestamps();

            $table->foreign('sub_penilaian_id')->references('id')->on('sub_penilaian')->onDelete('cascade');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_siswa');
        Schema::dropIfExists('sub_penilaian');
        Schema::dropIfExists('jenis_penilaian');
    }
};
