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
        Schema::create('jadwal_siswa', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hari_id');
            $table->unsignedBigInteger('kelas_id');
            $table->time('jam_masuk');
            $table->time('jam_pulang');
            $table->timestamps();

            $table->foreign('hari_id')->references('id')->on('hari');
            $table->foreign('kelas_id')->references('id')->on('kelas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_siswa');
    }
};
