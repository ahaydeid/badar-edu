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
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('foto')->nullable();
            $table->string('nipd')->nullable();
            $table->string('nisn')->nullable();
            $table->string('jenis_kelamin', 1);
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('nik')->nullable();
            $table->string('agama')->nullable();
            $table->text('alamat')->nullable();
            $table->string('rt', 5)->nullable();
            $table->string('rw', 5)->nullable();
            $table->string('dusun')->nullable();
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kode_pos', 10)->nullable();
            $table->string('jenis_tinggal')->nullable();
            $table->string('alat_transportasi')->nullable();
            $table->string('telepon')->nullable();
            $table->string('hp')->nullable();
            $table->string('email')->nullable();
            $table->string('skhun')->nullable();
            $table->boolean('penerima_kps')->default(false);
            $table->string('nomor_kps')->nullable();
            $table->unsignedBigInteger('rombel_saat_ini')->nullable();
            $table->string('no_peserta_un')->nullable();
            $table->string('no_seri_ijazah')->nullable();
            $table->boolean('penerima_kip')->default(false);
            $table->string('nomor_kip')->nullable();
            $table->string('nama_di_kip')->nullable();
            $table->string('nomor_kks')->nullable();
            $table->string('no_registrasi_akta_lahir')->nullable();
            $table->string('bank')->nullable();
            $table->string('nomor_rekening_bank')->nullable();
            $table->string('rekening_atas_nama')->nullable();
            $table->boolean('layak_pip')->default(false);
            $table->text('alasan_layak_pip')->nullable();
            $table->string('kebutuhan_khusus')->nullable();
            $table->string('sekolah_asal')->nullable();
            $table->tinyInteger('anak_ke')->nullable();
            $table->string('lintang')->nullable();
            $table->string('bujur')->nullable();
            $table->string('no_kk')->nullable();
            $table->smallInteger('berat_badan')->nullable();
            $table->smallInteger('tinggi_badan')->nullable();
            $table->smallInteger('lingkar_kepala')->nullable();
            $table->tinyInteger('jumlah_saudara_kandung')->nullable();
            $table->decimal('jarak_rumah_ke_sekolah_km', 5, 2)->nullable();
            $table->timestamps();

            // Index untuk rombel_saat_ini, FK akan ditambahkan nanti
            $table->index('rombel_saat_ini', 'fk_siswa_rombel');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
