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
        Schema::table('absen_kelas', function (Blueprint $table) {
            $table->dropForeign(['jadwal_id']);
            $table->foreign('jadwal_id')->references('id')->on('jadwal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('absen_kelas', function (Blueprint $table) {
            $table->dropForeign(['jadwal_id']);
            $table->foreign('jadwal_id')->references('id')->on('jadwal_siswa');
        });
    }
};
