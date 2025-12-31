<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HariSeeder extends Seeder
{
    public function run(): void
    {
        $hari = [
            ['nama' => 'Senin', 'hari_ke' => 1],
            ['nama' => 'Selasa', 'hari_ke' => 2],
            ['nama' => 'Rabu', 'hari_ke' => 3],
            ['nama' => 'Kamis', 'hari_ke' => 4],
            ['nama' => 'Jumat', 'hari_ke' => 5],
            ['nama' => 'Sabtu', 'hari_ke' => 6],
            ['nama' => 'Minggu', 'hari_ke' => 7],
        ];

        DB::table('hari')->insert($hari);
    }
}
