<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('poin_siswa', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('siswa_id')->unique();
            $table->integer('total_poin')->default(0);
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('poin_siswa');
    }
};
