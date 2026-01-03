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
        Schema::table('absen_guru', function (Blueprint $table) {
            $table->boolean('is_in_range')->default(true)->after('foto_selfie');
            $table->enum('status_verifikasi', ['AUTO', 'PENDING', 'APPROVED', 'REJECTED'])->default('AUTO')->after('is_in_range');
            $table->unsignedBigInteger('verified_by')->nullable()->after('status_verifikasi');
            $table->timestamp('verified_at')->nullable()->after('verified_by');

            $table->foreign('verified_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('absen_guru', function (Blueprint $table) {
            $table->dropForeign(['verified_by']);
            $table->dropColumn(['is_in_range', 'status_verifikasi', 'verified_by', 'verified_at']);
        });
    }
};
