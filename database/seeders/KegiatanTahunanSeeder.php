<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KegiatanTahunanSeeder extends Seeder
{
    public function run(): void
    {
        $kegiatanTahunan = [
            // Hari Libur Nasional
            ['nama' => 'Tahun Baru Masehi', 'tanggal' => 1, 'bulan' => 1, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Hari Kemerdekaan RI', 'tanggal' => 17, 'bulan' => 8, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Hari Buruh Internasional', 'tanggal' => 1, 'bulan' => 5, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Hari Pancasila', 'tanggal' => 1, 'bulan' => 6, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            
            // Hari Besar Keagamaan Islam (tanggal perkiraan, akan berubah tiap tahun)
            ['nama' => 'Tahun Baru Islam 1 Muharram', 'tanggal' => 7, 'bulan' => 7, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Maulid Nabi Muhammad SAW', 'tanggal' => 15, 'bulan' => 9, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Isra Miraj Nabi Muhammad SAW', 'tanggal' => 8, 'bulan' => 2, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Idul Fitri Hari Ke-1', 'tanggal' => 31, 'bulan' => 3, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Idul Fitri Hari Ke-2', 'tanggal' => 1, 'bulan' => 4, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Idul Adha', 'tanggal' => 7, 'bulan' => 6, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            
            // Hari Besar Keagamaan Lainnya
            ['nama' => 'Natal', 'tanggal' => 25, 'bulan' => 12, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Waisak', 'tanggal' => 23, 'bulan' => 5, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Nyepi (Tahun Baru Saka)', 'tanggal' => 22, 'bulan' => 3, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Kenaikan Yesus Kristus', 'tanggal' => 9, 'bulan' => 5, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            
            // Hari Penting Pendidikan (Hari Efektif)
            ['nama' => 'Hari Pendidikan Nasional', 'tanggal' => 2, 'bulan' => 5, 'kategori' => 'KEGIATAN', 'is_hari_efektif' => true],
            ['nama' => 'Hari Guru Nasional', 'tanggal' => 25, 'bulan' => 11, 'kategori' => 'KEGIATAN', 'is_hari_efektif' => true],
            ['nama' => 'Hari Sumpah Pemuda', 'tanggal' => 28, 'bulan' => 10, 'kategori' => 'KEGIATAN', 'is_hari_efektif' => true],
            ['nama' => 'Hari Pahlawan', 'tanggal' => 10, 'bulan' => 11, 'kategori' => 'KEGIATAN', 'is_hari_efektif' => true],
            
            // Kegiatan Akademik Tahunan
            ['nama' => 'Awal Tahun Ajaran', 'tanggal' => 15, 'bulan' => 7, 'kategori' => 'KEGIATAN', 'is_hari_efektif' => true],
            ['nama' => 'Ujian Tengah Semester Ganjil', 'tanggal' => 1, 'bulan' => 10, 'kategori' => 'UJIAN', 'is_hari_efektif' => true],
            ['nama' => 'Ujian Akhir Semester Ganjil', 'tanggal' => 1, 'bulan' => 12, 'kategori' => 'UJIAN', 'is_hari_efektif' => true],
            ['nama' => 'Pembagian Rapor Semester Ganjil', 'tanggal' => 20, 'bulan' => 12, 'kategori' => 'ADMINISTRASI', 'is_hari_efektif' => true],
            ['nama' => 'Libur Semester Ganjil Mulai', 'tanggal' => 21, 'bulan' => 12, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
            ['nama' => 'Ujian Tengah Semester Genap', 'tanggal' => 15, 'bulan' => 3, 'kategori' => 'UJIAN', 'is_hari_efektif' => true],
            ['nama' => 'Ujian Akhir Semester Genap', 'tanggal' => 1, 'bulan' => 6, 'kategori' => 'UJIAN', 'is_hari_efektif' => true],
            ['nama' => 'Pembagian Rapor Semester Genap', 'tanggal' => 20, 'bulan' => 6, 'kategori' => 'ADMINISTRASI', 'is_hari_efektif' => true],
            ['nama' => 'Libur Kenaikan Kelas Mulai', 'tanggal' => 21, 'bulan' => 6, 'kategori' => 'LIBUR', 'is_hari_efektif' => false],
        ];

        DB::table('kegiatan_tahunan')->insert($kegiatanTahunan);
    }
}
