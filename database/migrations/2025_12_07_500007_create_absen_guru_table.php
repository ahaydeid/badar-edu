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
        Schema::create('absen_guru', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('jadwal_id');
            $table->unsignedBigInteger('guru_id');
            $table->date('tanggal');
            $table->enum('metode_absen', ['rfid', 'geo'])->nullable();
            $table->time('jam_masuk')->nullable();
            $table->decimal('latitude', 20, 16)->nullable();
            $table->decimal('longitude', 20, 16)->nullable();
            $table->string('foto_selfie')->nullable();
            $table->time('jam_pulang')->nullable();
            $table->unsignedBigInteger('status_id');
            $table->text('keterangan')->nullable();
            $table->smallInteger('jp_total')->nullable();
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
        Schema::dropIfExists('absen_guru');
    }
};
