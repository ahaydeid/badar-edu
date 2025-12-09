<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class KedisiplinanSiswaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('kedisiplinan_siswa')->insert([
            [
                'id'=>1,
                'siswa_id'=>1,
                'kategori'=>'Kedisiplinan',
                'status'=>'Teguran',
                'tindakan'=>'Teguran lisan',
                'keterangan'=>'Datang terlambat 10 menit',
                'tanggal'=>'2025-07-18',
                'guru_id'=>1,
            ],
        ]);
    }
}
