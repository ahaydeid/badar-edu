<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('absen_jp_detail', function (Blueprint $table) {
            $table->foreignId('siswa_id')
                ->after('absen_jp_id')
                ->constrained('siswa')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('absen_jp_detail', function (Blueprint $table) {
            $table->dropForeign(['siswa_id']);
            $table->dropColumn('siswa_id');
        });
    }
};
