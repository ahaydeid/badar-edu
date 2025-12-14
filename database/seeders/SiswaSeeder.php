<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SiswaSeeder extends Seeder
{
public function run(): void
{
    DB::table('siswa')->insert([
        [
            'id' => 1,
            'nama' => 'Andi Pratama',
            'foto' => null,
            'nipd' => '2025001',
            'nisn' => '9988776655',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Bandung',
            'tanggal_lahir' => '2010-02-01',
            'nik' => '3210010202100001',
            'agama' => 'Islam',
            'alamat' => 'Jl. Mawar No. 1',
            'rt' => '001',
            'rw' => '002',
            'dusun' => null,
            'kelurahan' => 'Sukamaju',
            'kecamatan' => 'Cimahi',
            'kode_pos' => '40511',
            'jenis_tinggal' => 'Orang Tua',
            'alat_transportasi' => 'Jalan Kaki',
            'telepon' => null,
            'hp' => '081234567001',
            'email' => 'andi@example.com',
            'skhun' => null,
            'penerima_kps' => false,
            'nomor_kps' => null,

            // FK (saat ini memang NULL di DB)
            'rombel_saat_ini' => null,

            'no_peserta_un' => null,
            'no_seri_ijazah' => null,
            'penerima_kip' => false,
            'nomor_kip' => null,
            'nama_di_kip' => null,
            'nomor_kks' => null,
            'no_registrasi_akta_lahir' => null,
            'bank' => null,
            'nomor_rekening_bank' => null,
            'rekening_atas_nama' => null,
            'layak_pip' => false,
            'alasan_layak_pip' => null,
            'kebutuhan_khusus' => null,
            'sekolah_asal' => 'SMPN 1',
            'anak_ke' => 1,
            'lintang' => '-6.1862663565953975',
            'bujur' => '106.44876295229687',
            'no_kk' => null,
            'berat_badan' => 50,
            'tinggi_badan' => 160,
            'lingkar_kepala' => null,
            'jumlah_saudara_kandung' => 1,
            'jarak_rumah_ke_sekolah_km' => 2.50,

            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 2,
            'nama' => 'Bunga Lestari',
            'foto' => null,
            'nipd' => '2025002',
            'nisn' => '9988776656',
            'jenis_kelamin' => 'P',
            'tempat_lahir' => 'Bandung',
            'tanggal_lahir' => '2010-05-10',
            'nik' => '3210010202100002',
            'agama' => 'Islam',
            'alamat' => 'Jl. Melati No. 2',
            'rt' => '003',
            'rw' => '004',
            'dusun' => null,
            'kelurahan' => 'Sukamaju',
            'kecamatan' => 'Cimahi',
            'kode_pos' => '40511',
            'jenis_tinggal' => 'Orang Tua',
            'alat_transportasi' => 'Motor',
            'telepon' => null,
            'hp' => '081234567002',
            'email' => 'bunga@example.com',
            'skhun' => null,
            'penerima_kps' => false,
            'nomor_kps' => null,

            // FK (NULL sesuai dump)
            'rombel_saat_ini' => null,

            'no_peserta_un' => null,
            'no_seri_ijazah' => null,
            'penerima_kip' => false,
            'nomor_kip' => null,
            'nama_di_kip' => null,
            'nomor_kks' => null,
            'no_registrasi_akta_lahir' => null,
            'bank' => null,
            'nomor_rekening_bank' => null,
            'rekening_atas_nama' => null,
            'layak_pip' => false,
            'alasan_layak_pip' => null,
            'kebutuhan_khusus' => null,
            'sekolah_asal' => 'SMPN 1',
            'anak_ke' => 2,
            'lintang' => null,
            'bujur' => null,
            'no_kk' => null,
            'berat_badan' => 48,
            'tinggi_badan' => 158,
            'lingkar_kepala' => null,
            'jumlah_saudara_kandung' => 1,
            'jarak_rumah_ke_sekolah_km' => 3.00,

            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);
}

}
