<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AbsenJpSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('absen_jp')->insert([
            [
                'id'=>1,
                'jadwal_id'=>1,
                'siswa_id'=>1,
                'tanggal'=>'2025-07-16',
                'bulan'=>7,
                'semester_id'=>1,
            ],
            [
                'id'=>2,
                'jadwal_id'=>1,
                'siswa_id'=>2,
                'tanggal'=>'2025-07-16',
                'bulan'=>7,
                'semester_id'=>1,
            ],
        ]);
    }
}
