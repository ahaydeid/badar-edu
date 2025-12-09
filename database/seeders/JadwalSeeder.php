<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class JadwalSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('jadwal')->insert([
            [
                'id'=>1,
                'hari_id'=>1,
                'jam_id'=>1,
                'kelas_id'=>1,
                'guru_id'=>1,
                'mapel_id'=>1,
                'semester_id'=>1,
            ],
        ]);
    }
}
