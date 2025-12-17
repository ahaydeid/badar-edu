<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absen_harian_siswa', function (Blueprint $table) {
            $table->id();

            $table->foreignId('siswa_id')
                ->constrained('siswa')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('kelas_id')
                ->constrained('kelas')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->date('tanggal');

            $table->time('jam_masuk')->nullable();
            $table->time('jam_pulang')->nullable();

            $table->foreignId('status_id')
                ->constrained('jenis_absen')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->text('keterangan')->nullable();

            $table->enum('sumber', ['RFID', 'MANUAL', 'SYSTEM'])->default('SYSTEM');

            $table->timestamps();

            $table->unique(['siswa_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absen_harian_siswa');
    }
};
