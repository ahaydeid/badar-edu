<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hari', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->tinyInteger('hari_ke');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hari');
    }
};