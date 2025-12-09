<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kedisiplinan_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa');
            $table->string('kategori');
            $table->string('status');
            $table->text('tindakan')->nullable();
            $table->text('keterangan')->nullable();
            $table->date('tanggal');
            $table->foreignId('guru_id')->constrained('guru');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kedisiplinan_siswa');
    }
};