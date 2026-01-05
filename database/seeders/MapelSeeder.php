<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MapelSeeder extends Seeder
{
    public function run(): void
    {
        $mapel = [
            // ========== KELAS 10 ==========
            
            // Mapel Umum Kelas 10 (Semua Jurusan)
            ['kode_mapel' => 'PAI-10', 'nama' => 'Pendidikan Agama Islam dan Budi Pekerti', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#4CAF50'],
            ['kode_mapel' => 'PP-10', 'nama' => 'Pendidikan Pancasila', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#F44336'],
            ['kode_mapel' => 'BIND-10', 'nama' => 'Bahasa Indonesia', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#2196F3'],
            ['kode_mapel' => 'BING-10', 'nama' => 'Bahasa Inggris', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#9C27B0'],
            ['kode_mapel' => 'MTK-10', 'nama' => 'Matematika (Umum)', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#FF9800'],
            ['kode_mapel' => 'SEJ-10', 'nama' => 'Sejarah', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#795548'],
            ['kode_mapel' => 'INF-10', 'nama' => 'Informatika', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#607D8B'],
            ['kode_mapel' => 'PJOK-10', 'nama' => 'Pendidikan Jasmani, Olahraga, dan Kesehatan', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#00BCD4'],
            ['kode_mapel' => 'SR-10', 'nama' => 'Seni Rupa', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#E91E63'],
            ['kode_mapel' => 'PIPAS-10', 'nama' => 'Projek IPAS', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#009688'],
            ['kode_mapel' => 'BK-10', 'nama' => 'Bimbingan dan Konseling / Konselor (BP/BK)', 'kategori' => 'UMUM', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#FFEB3B'],
            
            // Mapel Produktif Kelas 10 - MPLB
            ['kode_mapel' => 'DMPLB-10', 'nama' => 'Dasar-dasar Manajemen Perkantoran dan Layanan Bisnis', 'kategori' => 'PRODUKTIF', 'tingkat' => 10, 'jurusan_id' => 1, 'guru_id' => null, 'warna_hex_mapel' => '#3F51B5'],
            
            // Mapel Produktif Kelas 10 - TKR
            ['kode_mapel' => 'DTO-10', 'nama' => 'Dasar-dasar Teknik Otomotif', 'kategori' => 'PRODUKTIF', 'tingkat' => 10, 'jurusan_id' => 2, 'guru_id' => null, 'warna_hex_mapel' => '#FF5722'],
            
            // Mapel Produktif Kelas 10 - TBSM (menggunakan DTO yang sama)
            ['kode_mapel' => 'DTO-10-TBSM', 'nama' => 'Dasar-dasar Teknik Otomotif', 'kategori' => 'PRODUKTIF', 'tingkat' => 10, 'jurusan_id' => 3, 'guru_id' => null, 'warna_hex_mapel' => '#FF5722'],
            
            // ========== KELAS 11 ==========
            
            // Mapel Umum Kelas 11 (Semua Jurusan)
            ['kode_mapel' => 'PAI-11', 'nama' => 'Pendidikan Agama Islam dan Budi Pekerti', 'kategori' => 'UMUM', 'tingkat' => 11, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#4CAF50'],
            ['kode_mapel' => 'PP-11', 'nama' => 'Pendidikan Pancasila', 'kategori' => 'UMUM', 'tingkat' => 11, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#F44336'],
            ['kode_mapel' => 'BIND-11', 'nama' => 'Bahasa Indonesia', 'kategori' => 'UMUM', 'tingkat' => 11, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#2196F3'],
            ['kode_mapel' => 'BING-11', 'nama' => 'Bahasa Inggris', 'kategori' => 'UMUM', 'tingkat' => 11, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#9C27B0'],
            ['kode_mapel' => 'MTK-11', 'nama' => 'Matematika (Umum)', 'kategori' => 'UMUM', 'tingkat' => 11, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#FF9800'],
            ['kode_mapel' => 'SEJ-11', 'nama' => 'Sejarah', 'kategori' => 'UMUM', 'tingkat' => 11, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#795548'],
            ['kode_mapel' => 'PJOK-11', 'nama' => 'Pendidikan Jasmani, Olahraga, dan Kesehatan', 'kategori' => 'UMUM', 'tingkat' => 11, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#00BCD4'],
            ['kode_mapel' => 'KIK-11', 'nama' => 'Kreativitas, Inovasi, dan Kewirausahaan', 'kategori' => 'UMUM', 'tingkat' => 11, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#FFC107'],
            ['kode_mapel' => 'BK-11', 'nama' => 'Bimbingan dan Konseling / Konselor (BP/BK)', 'kategori' => 'UMUM', 'tingkat' => 11, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#FFEB3B'],
            
            // Mapel Produktif Kelas 11 - MPLB
            ['kode_mapel' => 'MP-11', 'nama' => 'Manajemen Perkantoran', 'kategori' => 'PRODUKTIF', 'tingkat' => 11, 'jurusan_id' => 1, 'guru_id' => null, 'warna_hex_mapel' => '#3F51B5'],
            
            // Mapel Produktif Kelas 11 - TKR
            ['kode_mapel' => 'TKR-11', 'nama' => 'Teknik Kendaraan Ringan', 'kategori' => 'PRODUKTIF', 'tingkat' => 11, 'jurusan_id' => 2, 'guru_id' => null, 'warna_hex_mapel' => '#FF5722'],
            
            // Mapel Produktif Kelas 11 - TBSM
            ['kode_mapel' => 'TSM-11', 'nama' => 'Teknik Sepeda Motor', 'kategori' => 'PRODUKTIF', 'tingkat' => 11, 'jurusan_id' => 3, 'guru_id' => null, 'warna_hex_mapel' => '#CDDC39'],
            
            // ========== KELAS 12 ==========
            
            // Mapel Umum Kelas 12 (Semua Jurusan)
            ['kode_mapel' => 'PAI-12', 'nama' => 'Pendidikan Agama Islam dan Budi Pekerti', 'kategori' => 'UMUM', 'tingkat' => 12, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#4CAF50'],
            ['kode_mapel' => 'PP-12', 'nama' => 'Pendidikan Pancasila', 'kategori' => 'UMUM', 'tingkat' => 12, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#F44336'],
            ['kode_mapel' => 'BIND-12', 'nama' => 'Bahasa Indonesia', 'kategori' => 'UMUM', 'tingkat' => 12, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#2196F3'],
            ['kode_mapel' => 'BING-12', 'nama' => 'Bahasa Inggris', 'kategori' => 'UMUM', 'tingkat' => 12, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#9C27B0'],
            ['kode_mapel' => 'MTK-12', 'nama' => 'Matematika (Umum)', 'kategori' => 'UMUM', 'tingkat' => 12, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#FF9800'],
            ['kode_mapel' => 'PJOK-12', 'nama' => 'Pendidikan Jasmani, Olahraga, dan Kesehatan', 'kategori' => 'UMUM', 'tingkat' => 12, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#00BCD4'],
            ['kode_mapel' => 'KIK-12', 'nama' => 'Kreativitas, Inovasi, dan Kewirausahaan', 'kategori' => 'UMUM', 'tingkat' => 12, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#FFC107'],
            ['kode_mapel' => 'BK-12', 'nama' => 'Bimbingan dan Konseling / Konselor (BP/BK)', 'kategori' => 'UMUM', 'tingkat' => 12, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#FFEB3B'],
            
            // Mapel Produktif Kelas 12 - MPLB
            ['kode_mapel' => 'MP-12', 'nama' => 'Manajemen Perkantoran', 'kategori' => 'PRODUKTIF', 'tingkat' => 12, 'jurusan_id' => 1, 'guru_id' => null, 'warna_hex_mapel' => '#3F51B5'],
            
            // Mapel Produktif Kelas 12 - TKR
            ['kode_mapel' => 'TKR-12', 'nama' => 'Teknik Kendaraan Ringan', 'kategori' => 'PRODUKTIF', 'tingkat' => 12, 'jurusan_id' => 2, 'guru_id' => null, 'warna_hex_mapel' => '#FF5722'],
            
            // Mapel Produktif Kelas 12 - TBSM
            ['kode_mapel' => 'TSM-12', 'nama' => 'Teknik Sepeda Motor', 'kategori' => 'PRODUKTIF', 'tingkat' => 12, 'jurusan_id' => 3, 'guru_id' => null, 'warna_hex_mapel' => '#CDDC39'],
            
            // ========== MATA PELAJARAN PILIHAN ==========
            
            ['kode_mapel' => 'KKA-10', 'nama' => 'Koding dan Kecerdasan Artifisial', 'kategori' => 'PILIHAN', 'tingkat' => 10, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#673AB7'],
            ['kode_mapel' => 'INF-11-PIL', 'nama' => 'Informatika', 'kategori' => 'PILIHAN', 'tingkat' => 11, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#607D8B'],
            ['kode_mapel' => 'ARAB-12', 'nama' => 'Bahasa Arab', 'kategori' => 'PILIHAN', 'tingkat' => 12, 'jurusan_id' => null, 'guru_id' => null, 'warna_hex_mapel' => '#8BC34A'],
        ];

        DB::table('mapel')->insert($mapel);
    }
}
