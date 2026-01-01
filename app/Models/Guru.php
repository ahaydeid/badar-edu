<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    protected $table = 'guru';

    protected $fillable = [
        'kode_guru',
        'nama',
        'foto',
        'nuptk',
        'nik',
        'nip',
        'jk',
        'tempat_lahir',
        'tanggal_lahir',
        'status_kepegawaian',
        'jenis_ptk',
        'gelar_depan',
        'gelar_belakang',
        'jenjang',
        'prodi',
        'sertifikasi',
        'tmt_kerja',
        'tugas_tambahan',
        'mengajar',
        'jam_tugas_tambahan',
        'jjm',
        'total_jjm',
        'kompetensi',
    ];



    public function absensi()
    {
        return $this->hasMany(AbsenGuru::class, 'guru_id');
    }

    public function jadwal()
    {
        return $this->hasMany(Jadwal::class, 'guru_id');
    }

    public function kelasBinaan()
    {
        return $this->hasMany(Kelas::class, 'wali_guru_id');
    }

    public function jenisPenilaian()
    {
        return $this->hasMany(JenisPenilaian::class, 'guru_id');
    }

    public function user()
    {
        return $this->morphOne(User::class, 'profile');
    }

    protected static function booted()
    {
        static::deleting(function ($guru) {
            // 1. Cek Jadwal Mengajar
            if ($guru->jadwal()->exists()) {
                throw new \Exception('Guru ini masih memiliki jadwal mengajar aktif. Hapus jadwal terlebih dahulu.');
            }

            // 2. Cek Wali Kelas
            if ($guru->kelasBinaan()->exists()) {
                throw new \Exception('Guru ini masih terdaftar sebagai Wali Kelas. Harap ganti wali kelas terlebih dahulu.');
            }

            // 3. Cek Data Penilaian (CRITICAL)
            if ($guru->jenisPenilaian()->exists()) {
                throw new \Exception('Guru ini memiliki data penilaian siswa (Nilai Mapel). Penghapusan ditolak demi keamanan data siswa. Silakan non-aktifkan akun saja.');
            }

            // 4. Safe to Delete? Clean up User account
            if ($guru->user) {
                $guru->user->delete();
            }
        });
    }
}
