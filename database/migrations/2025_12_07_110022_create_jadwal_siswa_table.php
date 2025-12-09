<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hari_id')->constrained('hari');
            $table->foreignId('kelas_id')->constrained('kelas');
            $table->time('jam_masuk');
            $table->time('jam_pulang');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_siswa');
    }
};