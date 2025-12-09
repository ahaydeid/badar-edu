<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absen_jp_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('absen_jp_id')->constrained('absen_jp')->onDelete('cascade');
            $table->foreignId('jenis_absen_id')->constrained('jenis_absen');
            $table->integer('jumlah')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absen_jp_detail');
    }
};