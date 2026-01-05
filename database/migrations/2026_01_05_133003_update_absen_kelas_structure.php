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
            // Rename keterangan to catatan
            $table->renameColumn('keterangan', 'catatan');
            
            // Add is_selesai flag
            $table->boolean('is_selesai')->default(false)->after('jam_pulang');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('absen_kelas', function (Blueprint $table) {
            $table->renameColumn('catatan', 'keterangan');
            $table->dropColumn('is_selesai');
        });
    }
};
