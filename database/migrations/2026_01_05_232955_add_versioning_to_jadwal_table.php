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
        Schema::table('jadwal', function (Blueprint $table) {
            // Versioning columns
            $table->unsignedBigInteger('parent_id')->nullable()->after('id');
            $table->integer('version')->default(1)->after('parent_id');
            $table->date('berlaku_dari')->nullable()->after('semester_id');
            $table->date('berlaku_sampai')->nullable()->after('berlaku_dari');
            $table->boolean('is_active')->default(true)->after('berlaku_sampai');
            
            // Foreign key for parent relationship
            $table->foreign('parent_id')->references('id')->on('jadwal')->onDelete('set null');
            
            // Indexes for performance
            $table->index(['semester_id', 'is_active'], 'idx_jadwal_semester_active');
            $table->index(['berlaku_dari', 'berlaku_sampai'], 'idx_jadwal_date_range');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            // Drop indexes first
            $table->dropIndex('idx_jadwal_semester_active');
            $table->dropIndex('idx_jadwal_date_range');
            
            // Drop foreign key
            $table->dropForeign(['parent_id']);
            
            // Drop columns
            $table->dropColumn([
                'parent_id',
                'version',
                'berlaku_dari',
                'berlaku_sampai',
                'is_active'
            ]);
        });
    }
};
