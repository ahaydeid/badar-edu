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
        // 1. Tabel User Khusus PPDB (Calon Siswa)
        Schema::create('ppdb_users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('nama_lengkap'); // Nama untuk display akun
            $table->string('no_hp')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Tabel Periode / Gelombang PPDB
        Schema::create('ppdb_periods', function (Blueprint $table) {
            $table->id();
            $table->string('tahun_ajaran'); // e.g. "2025/2026"
            $table->string('gelombang'); // e.g. "Gelombang 1"
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('Aktif'); // Aktif, Tutup, Arsip
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });

        // 3. Tabel Kuota per Jurusan di Periode tertentu
        Schema::create('ppdb_jurusan_kuota', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_period_id')->constrained('ppdb_periods')->onDelete('cascade');
            $table->foreignId('jurusan_id')->constrained('jurusan')->onDelete('cascade');
            $table->integer('kuota')->default(0);
            $table->integer('terisi')->default(0); // Cache count
            $table->timestamps();
        });

        // 4. Tabel Pendaftar (Data Utama Siswa)
        Schema::create('pendaftars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_user_id')->constrained('ppdb_users')->onDelete('cascade');
            $table->foreignId('ppdb_period_id')->constrained('ppdb_periods'); // Mendaftar di gelombang mana
            $table->foreignId('jurusan_id')->constrained('jurusan'); // Pilihan jurusan
            
            $table->string('no_pendaftaran')->unique(); // Generated e.g. PPDB-2025-001
            $table->enum('status', ['Menunggu Verifikasi', 'Perlu Perbaikan', 'Terverifikasi', 'Diterima', 'Cadangan', 'Ditolak', 'Daftar Ulang'])->default('Menunggu Verifikasi');
            
            // Biodata
            $table->string('nisn')->unique()->nullable();
            $table->string('nik')->nullable();
            $table->string('nama_lengkap');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('agama')->nullable();
            $table->string('no_hp_siswa')->nullable();

            // Alamat
            $table->string('alamat_jalan')->nullable();
            $table->string('rt_rw')->nullable();
            $table->string('desa_kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kota_kabupaten')->nullable();
            $table->string('provinsi')->nullable();
            $table->string('kode_pos')->nullable();

            // Sekolah Asal
            $table->string('asal_sekolah')->nullable();
            $table->string('npsn_sekolah_asal')->nullable();
            $table->year('tahun_lulus')->nullable();

            // Orang Tua
            $table->string('nama_ayah')->nullable();
            $table->string('pekerjaan_ayah')->nullable();
            $table->string('no_hp_ayah')->nullable();
            $table->string('nama_ibu')->nullable();
            $table->string('pekerjaan_ibu')->nullable();
            $table->string('no_hp_ibu')->nullable();
            $table->string('nama_wali')->nullable();
            $table->string('pekerjaan_wali')->nullable();
            $table->string('no_hp_wali')->nullable();
            $table->text('alamat_orang_tua')->nullable();

            $table->timestamps();
        });

        // 5. Tabel Dokumen Pendaftar
        Schema::create('pendaftar_dokumens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftar_id')->constrained('pendaftars')->onDelete('cascade');
            $table->string('jenis_dokumen'); // KK, Akta, Ijazah, Foto, dll
            $table->string('file_path');
            $table->string('original_name')->nullable();
            $table->boolean('is_valid')->nullable(); // null=belum dicek, true=valid, false=invalid
            $table->text('catatan_verifikasi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftar_dokumens');
        Schema::dropIfExists('pendaftars');
        Schema::dropIfExists('ppdb_jurusan_kuota');
        Schema::dropIfExists('ppdb_periods');
        Schema::dropIfExists('ppdb_users');
    }
};
