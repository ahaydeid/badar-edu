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
        Schema::create('pengajuan_absen_guru', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('jadwal_id');
            $table->unsignedBigInteger('guru_id');
            $table->date('tanggal');
            $table->unsignedBigInteger('status_id');
            $table->text('alasan')->nullable();
            $table->enum('status_pengajuan', ['DITERIMA', 'DITOLAK'])->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->foreign('jadwal_id')->references('id')->on('jadwal');
            $table->foreign('guru_id')->references('id')->on('guru');
            $table->foreign('status_id')->references('id')->on('jenis_absen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengajuan_absen_guru');
    }
};
