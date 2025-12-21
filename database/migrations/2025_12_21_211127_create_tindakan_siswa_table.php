<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tindakan_siswa', function (Blueprint $table) {
            $table->id();

            $table->foreignId('siswa_id')
                ->constrained('siswa')
                ->cascadeOnDelete();

            $table->foreignId('sanksi_siswa_id')
                ->nullable()
                ->constrained('sanksi_siswa')
                ->nullOnDelete();

            $table->string('jenis_tindakan', 100);
            $table->text('keterangan')->nullable();

            $table->date('tanggal');

            $table->foreignId('dibuat_oleh')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->index(['siswa_id', 'sanksi_siswa_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tindakan_siswa');
    }
};
