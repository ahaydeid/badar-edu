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
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->tinyInteger('tingkat');
            $table->unsignedBigInteger('jurusan_id');
            $table->unsignedBigInteger('wali_guru_id')->nullable();
            $table->timestamps();

            $table->foreign('jurusan_id')->references('id')->on('jurusan');
            $table->foreign('wali_guru_id')->references('id')->on('guru');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
