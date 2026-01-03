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
        Schema::table('jenis_penilaian', function (Blueprint $table) {
            $table->boolean('has_sub')->default(true)->after('bobot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jenis_penilaian', function (Blueprint $table) {
            $table->dropColumn('has_sub');
        });
    }
};
