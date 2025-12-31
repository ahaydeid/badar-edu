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
        Schema::create('absen_kelas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('jadwal_id');
            $table->time('jam_masuk');
            $table->time('jam_pulang')->nullable();
            $table->date('tanggal');
            $table->unsignedBigInteger('status_id')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->foreign('jadwal_id')->references('id')->on('jadwal_siswa');
            $table->foreign('status_id')->references('id')->on('jenis_absen')->onUpdate('cascade');
            $table->index('status_id', 'idx_absen_kelas_status_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absen_kelas');
    }
};
