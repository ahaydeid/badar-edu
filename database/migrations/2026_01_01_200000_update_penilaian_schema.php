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
        // Update jenis_penilaian
        Schema::table('jenis_penilaian', function (Blueprint $table) {
            $table->integer('bobot')->default(0)->after('nama');
        });

        // Create nilai_akhir
        Schema::create('nilai_akhir', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('siswa_id');
            $table->unsignedBigInteger('mapel_id');
            $table->unsignedBigInteger('kelas_id');
            $table->unsignedBigInteger('semester_id');
            $table->unsignedBigInteger('guru_id');
            $table->decimal('nilai_akhir', 5, 2);
            $table->string('predikat')->nullable(); // A, B, C etc
            $table->enum('status', ['draft', 'dikirim'])->default('draft');
            $table->timestamps();

            // Foreign Keys
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->foreign('mapel_id')->references('id')->on('mapel')->onDelete('cascade');
            $table->foreign('kelas_id')->references('id')->on('kelas')->onDelete('cascade');
            $table->foreign('semester_id')->references('id')->on('semester')->onDelete('cascade');
            $table->foreign('guru_id')->references('id')->on('guru')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_akhir');
        
        Schema::table('jenis_penilaian', function (Blueprint $table) {
            $table->dropColumn('bobot');
        });
    }
};
