<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guru', function (Blueprint $table) {
            $table->id();
            $table->string('kode_guru')->unique();
            $table->string('nama');
            $table->string('foto')->nullable();
            $table->string('nuptk')->nullable();
            $table->enum('jk', ['L','P']);
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('nik')->nullable();
            $table->string('nip')->nullable();
            $table->string('status_kepegawaian')->nullable();
            $table->string('jenis_ptk')->nullable();
            $table->string('gelar_depan')->nullable();
            $table->string('gelar_belakang')->nullable();
            $table->string('jenjang')->nullable();
            $table->string('prodi')->nullable();
            $table->string('sertifikasi')->nullable();
            $table->date('tmt_kerja')->nullable();
            $table->string('tugas_tambahan')->nullable();
            $table->string('mengajar')->nullable();
            $table->smallInteger('jam_tugas_tambahan')->nullable();
            $table->smallInteger('jjm')->nullable();
            $table->smallInteger('total_jjm')->nullable();
            $table->text('kompetensi')->nullable();
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('guru');
    }
};