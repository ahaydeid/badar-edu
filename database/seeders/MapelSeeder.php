<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MapelSeeder extends Seeder
{
    public function run(): void
    {
        $mapel = [
            // Mapel Umum (semua jurusan, tingkat 10-12)
            ['kode_mapel' => 'PAI', 'nama' => 'Pendidikan Agama Islam', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'warna_hex_mapel' => '#4CAF50'],
            ['kode_mapel' => 'PKN', 'nama' => 'Pendidikan Kewarganegaraan', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'warna_hex_mapel' => '#F44336'],
            ['kode_mapel' => 'BIND', 'nama' => 'Bahasa Indonesia', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'warna_hex_mapel' => '#2196F3'],
            ['kode_mapel' => 'MTK', 'nama' => 'Matematika', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'warna_hex_mapel' => '#FF9800'],
            ['kode_mapel' => 'BING', 'nama' => 'Bahasa Inggris', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'warna_hex_mapel' => '#9C27B0'],
            ['kode_mapel' => 'PJOK', 'nama' => 'Pendidikan Jasmani', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'warna_hex_mapel' => '#00BCD4'],
            
            // Mapel Produktif MPLB (jurusan_id = 1)
            ['kode_mapel' => 'ADMPK', 'nama' => 'Administrasi Perkantoran', 'kategori' => 'PRODUKTIF', 'tingkat' => 10, 'jurusan_id' => 1, 'warna_hex_mapel' => '#3F51B5'],
            ['kode_mapel' => 'KORESPONDEN', 'nama' => 'Korespondensi', 'kategori' => 'PRODUKTIF', 'tingkat' => 10, 'jurusan_id' => 1, 'warna_hex_mapel' => '#009688'],
            ['kode_mapel' => 'OTOMATKTR', 'nama' => 'Otomatisasi Tata Kelola Kantor', 'kategori' => 'PRODUKTIF', 'tingkat' => 11, 'jurusan_id' => 1, 'warna_hex_mapel' => '#795548'],
            ['kode_mapel' => 'LAYANBIS', 'nama' => 'Layanan Bisnis', 'kategori' => 'PRODUKTIF', 'tingkat' => 11, 'jurusan_id' => 1, 'warna_hex_mapel' => '#607D8B'],
            
            // Mapel Produktif TKR (jurusan_id = 2)
            ['kode_mapel' => 'PKKR', 'nama' => 'Pemeliharaan Kelistrikan Kendaraan Ringan', 'kategori' => 'PRODUKTIF', 'tingkat' => 10, 'jurusan_id' => 2, 'warna_hex_mapel' => '#FF5722'],
            ['kode_mapel' => 'PCMKR', 'nama' => 'Pemeliharaan Chasis dan Mesin Kendaraan Ringan', 'kategori' => 'PRODUKTIF', 'tingkat' => 10, 'jurusan_id' => 2, 'warna_hex_mapel' => '#673AB7'],
            ['kode_mapel' => 'TEKNOLOGI', 'nama' => 'Teknologi Dasar Otomotif', 'kategori' => 'PRODUKTIF', 'tingkat' => 10, 'jurusan_id' => 2, 'warna_hex_mapel' => '#E91E63'],
            
            // Mapel Produktif TBSM (jurusan_id = 3)
            ['kode_mapel' => 'PKSM', 'nama' => 'Pemeliharaan Kelistrikan Sepeda Motor', 'kategori' => 'PRODUKTIF', 'tingkat' => 10, 'jurusan_id' => 3, 'warna_hex_mapel' => '#FFEB3B'],
            ['kode_mapel' => 'PCMSM', 'nama' => 'Pemeliharaan Chasis dan Mesin Sepeda Motor', 'kategori' => 'PRODUKTIF', 'tingkat' => 10, 'jurusan_id' => 3, 'warna_hex_mapel' => '#CDDC39'],
            ['kode_mapel' => 'BISNISSM', 'nama' => 'Bisnis Sepeda Motor', 'kategori' => 'PRODUKTIF', 'tingkat' => 11, 'jurusan_id' => 3, 'warna_hex_mapel' => '#FFC107'],
        ];

        DB::table('mapel')->insert($mapel);
    }
}
