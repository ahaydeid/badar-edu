<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    protected $table = 'siswa';

    protected $fillable = [
        'nama',
        'foto',

        'nipd',
        'nisn',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'nik',
        'agama',
        'alamat',
        'rt',
        'rw',
        'dusun',
        'kelurahan',
        'kecamatan',
        'kode_pos',
        'jenis_tinggal',
        'alat_transportasi',
        'telepon',
        'hp',
        'email',
        'skhun',

        'penerima_kps',
        'nomor_kps',

        // FK ke kelas
        'rombel_saat_ini',

        'no_peserta_un',
        'no_seri_ijazah',

        'penerima_kip',
        'nomor_kip',
        'nama_di_kip',
        'nomor_kks',
        'no_registrasi_akta_lahir',

        'bank',
        'nomor_rekening_bank',
        'rekening_atas_nama',

        'layak_pip',
        'alasan_layak_pip',

        'kebutuhan_khusus',
        'sekolah_asal',

        'anak_ke',
        'lintang',
        'bujur',
        'no_kk',

        'berat_badan',
        'tinggi_badan',
        'lingkar_kepala',
        'jumlah_saudara_kandung',

        'jarak_rumah_ke_sekolah_km',
    ];

    public function wali()
    {
        return $this->hasMany(WaliSiswa::class, 'siswa_id');
    }


    public function rombel()
    {
        return $this->belongsTo(Kelas::class, 'rombel_saat_ini');
    }
    public function absenHarian()
{
    return $this->hasMany(AbsenHarianSiswa::class, 'siswa_id');
}

    public function user()
    {
        return $this->morphOne(User::class, 'profile');
    }

}
