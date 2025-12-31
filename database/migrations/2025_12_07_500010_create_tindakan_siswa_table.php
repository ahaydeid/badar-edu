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
        Schema::create('tindakan_siswa', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('siswa_id');
            $table->unsignedBigInteger('sanksi_siswa_id')->nullable();
            $table->string('jenis_tindakan', 100);
            $table->text('keterangan')->nullable();
            $table->date('tanggal');
            $table->unsignedBigInteger('dibuat_oleh')->nullable();
            $table->timestamps();

            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->foreign('sanksi_siswa_id')->references('id')->on('sanksi_siswa')->onDelete('set null');
            $table->foreign('dibuat_oleh')->references('id')->on('users')->onDelete('set null');
            $table->index(['siswa_id', 'sanksi_siswa_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tindakan_siswa');
    }
};
