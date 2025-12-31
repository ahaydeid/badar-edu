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
        Schema::create('absen_jp_detail', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('absen_jp_id');
            $table->unsignedBigInteger('siswa_id');
            $table->unsignedBigInteger('jenis_absen_id');
            $table->integer('jumlah')->default(0);
            $table->timestamps();

            $table->foreign('absen_jp_id')->references('id')->on('absen_jp')->onDelete('cascade');
            $table->foreign('siswa_id', 'fk_absen_jp_detail_siswa')->references('id')->on('siswa')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('jenis_absen_id')->references('id')->on('jenis_absen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absen_jp_detail');
    }
};
