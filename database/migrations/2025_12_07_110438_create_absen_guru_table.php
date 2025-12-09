<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absen_guru', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_id')->constrained('jadwal');
            $table->foreignId('guru_id')->constrained('guru');
            $table->date('tanggal');
            $table->time('jam_masuk')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('foto_selfie')->nullable();
            $table->time('jam_pulang')->nullable();
            $table->foreignId('status_id')->constrained('jenis_absen');
            $table->text('keterangan')->nullable();
            $table->smallInteger('jp_total')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absen_guru');
    }
};