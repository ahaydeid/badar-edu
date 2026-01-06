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
        Schema::create('ppdb_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_user_id')->constrained('ppdb_users')->onDelete('cascade');
            $table->string('otp_code');
            $table->dateTime('expires_at');
            $table->integer('attempts')->default(0);
            $table->string('type')->default('registration'); // registration, reset_password
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppdb_verifications');
    }
};
