<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pelanggaran_siswa', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('siswa_id');
            $table->unsignedBigInteger('jenis_pelanggaran_id');
            $table->integer('poin');
            $table->date('tanggal');
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->foreign('jenis_pelanggaran_id')
                  ->references('id')
                  ->on('jenis_pelanggaran')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pelanggaran_siswa');
    }
};
