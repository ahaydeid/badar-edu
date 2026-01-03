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
        Schema::create('master_data_configs', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // 'guru_pegawai' or 'siswa'
            $table->boolean('can_edit')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default values
        DB::table('master_data_configs')->insert([
            [
                'key' => 'guru_pegawai',
                'can_edit' => true,
                'description' => 'Izinkan pengeditan data guru dan pegawai',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'siswa',
                'can_edit' => true,
                'description' => 'Izinkan pengeditan data siswa',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_data_configs');
    }
};
