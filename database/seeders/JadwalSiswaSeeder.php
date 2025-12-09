<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class JadwalSiswaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('jadwal_siswa')->insert([
            [
                'id'=>1,
                'hari_id'=>1,
                'kelas_id'=>1,
                'jam_masuk'=>'07:00',
                'jam_pulang'=>'12:00',
            ],
        ]);
    }
}
