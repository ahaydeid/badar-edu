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
        Schema::table('hari', function (Blueprint $table) {
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE')->after('hari_ke');
        });

        Schema::table('jam', function (Blueprint $table) {
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE')->after('jumlah_jp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hari', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('jam', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
