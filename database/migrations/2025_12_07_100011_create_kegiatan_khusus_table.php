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
        Schema::create('kegiatan_khusus', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->enum('kategori', ['KEGIATAN', 'ADMINISTRASI', 'LIBUR', 'UJIAN']);
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->smallInteger('tahun');
            $table->boolean('is_hari_efektif')->default(true);
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kegiatan_khusus');
    }
};
