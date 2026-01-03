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
        Schema::create('absen_lokasi_kantor', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->decimal('latitude', 20, 16);
            $table->decimal('longitude', 20, 16);
            $table->integer('radius')->default(100)->comment('Jarak radius dalam meter');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absen_lokasi_kantor');
    }
};
