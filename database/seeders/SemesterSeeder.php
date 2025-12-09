<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SemesterSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('semester')->insert([
            [
                'id'=>1,
                'nama'=>'2025/2026 - Ganjil',
                'tipe'=>'GANJIL',
                'tahun_ajaran_dari'=>2025,
                'tahun_ajaran_sampai'=>2026,
                'tanggal_mulai'=>'2025-07-15',
                'tanggal_selesai'=>'2025-12-20',
            ],
        ]);
    }
}
