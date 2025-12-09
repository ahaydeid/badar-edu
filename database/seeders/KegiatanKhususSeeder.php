<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class KegiatanKhususSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('kegiatan_khusus')->insert([
            [
                'id'=>1,
                'nama'=>'Masa Pengenalan Lingkungan Sekolah (MPLS)',
                'kategori'=>'KEGIATAN',
                'tanggal_mulai'=>'2025-07-10',
                'tanggal_selesai'=>'2025-07-12',
                'tahun'=>2025,
                'is_hari_efektif'=>true,
                'status'=>'ACTIVE',
            ],
        ]);
    }
}
