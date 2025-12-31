<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PengumumanSeeder extends Seeder
{
    public function run(): void
    {
        $pengumuman = [
            [
                'judul' => 'Selamat Datang Tahun Ajaran Baru 2024/2025',
                'isi' => 'Selamat datang di tahun ajaran baru 2024/2025. Semoga tahun ini menjadi tahun yang penuh berkah dan prestasi.',
                'tanggal_mulai' => '2024-07-01',
                'tanggal_selesai' => '2024-07-31',
                'target' => 'semua',
                'is_active' => true,
            ],
            [
                'judul' => 'Ujian Tengah Semester',
                'isi' => 'Ujian Tengah Semester akan dilaksanakan pada tanggal 15-20 Oktober 2024. Harap mempersiapkan diri dengan baik.',
                'tanggal_mulai' => '2024-10-01',
                'tanggal_selesai' => '2024-10-20',
                'target' => 'siswa',
                'is_active' => true,
            ],
            [
                'judul' => 'Rapat Guru',
                'isi' => 'Rapat koordinasi guru akan dilaksanakan pada hari Sabtu, 5 Oktober 2024 pukul 08.00 WIB.',
                'tanggal_mulai' => '2024-10-01',
                'tanggal_selesai' => '2024-10-05',
                'target' => 'guru',
                'is_active' => true,
            ],
        ];

        DB::table('pengumuman')->insert($pengumuman);
    }
}
