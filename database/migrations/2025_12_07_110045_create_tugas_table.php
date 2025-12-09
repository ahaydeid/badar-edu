<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tugas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('guru');
            $table->foreignId('mapel_id')->constrained('mapel');
            $table->foreignId('kelas_id')->constrained('kelas');
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('file_url')->nullable();
            $table->dateTime('deadline')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tugas');
    }
};
