<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JamSeeder extends Seeder
{
    public function run(): void
    {
        $jam = [
            ['nama' => 'J-1', 'jam_mulai' => '07:30:00', 'jam_selesai' => '08:15:00', 'jumlah_jp' => 1],
            ['nama' => 'J-2', 'jam_mulai' => '08:15:00', 'jam_selesai' => '09:00:00', 'jumlah_jp' => 1],
            ['nama' => 'Istirahat', 'jam_mulai' => '09:00:00', 'jam_selesai' => '09:45:00', 'jumlah_jp' => 0],
            ['nama' => 'J-3', 'jam_mulai' => '09:45:00', 'jam_selesai' => '10:30:00', 'jumlah_jp' => 1],
            ['nama' => 'J-4', 'jam_mulai' => '10:30:00', 'jam_selesai' => '11:15:00', 'jumlah_jp' => 1],
            ['nama' => 'J-5', 'jam_mulai' => '11:15:00', 'jam_selesai' => '12:00:00', 'jumlah_jp' => 1],
        ];

        DB::table('jam')->insert($jam);
    }
}
