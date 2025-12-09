<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mapel', function (Blueprint $table) {
            $table->id();
            $table->string('kode_mapel');
            $table->string('nama');
            $table->string('kategori');
            $table->tinyInteger('tingkat');
            $table->foreignId('jurusan_id')->nullable()->constrained('jurusan');
            $table->string('warna_hex_mapel')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mapel');
    }
};