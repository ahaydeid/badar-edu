<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class KegiatanTahunanSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('kegiatan_tahunan')->insert([
            [
                'id'=>1,
                'nama'=>'Hari Kemerdekaan',
                'kategori'=>'KEGIATAN',
                'tanggal'=>17,
                'bulan'=>8,
                'is_hari_efektif'=>false,
                'status'=>'ACTIVE',
            ],
        ]);
    }
}
