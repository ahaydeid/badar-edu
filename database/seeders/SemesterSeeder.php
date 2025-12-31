<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SemesterSeeder extends Seeder
{
    public function run(): void
    {
        $semester = [
            [
                'nama' => 'Semester Ganjil 2025/2026',
                'tipe' => 'GANJIL',
                'tahun_ajaran_dari' => 2025,
                'tahun_ajaran_sampai' => 2026,
                'tanggal_mulai' => '2025-07-15',
                'tanggal_selesai' => '2025-12-20',
            ],
            [
                'nama' => 'Semester Genap 2025/2026',
                'tipe' => 'GENAP',
                'tahun_ajaran_dari' => 2025,
                'tahun_ajaran_sampai' => 2026,
                'tanggal_mulai' => '2026-01-06',
                'tanggal_selesai' => '2026-06-20',
            ],
        ];

        DB::table('semester')->insert($semester);
    }
}
