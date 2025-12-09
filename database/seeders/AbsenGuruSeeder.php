<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AbsenGuruSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('absen_guru')->insert([
            [
                'id'=>1,
                'jadwal_id'=>1,
                'guru_id'=>1,
                'tanggal'=>'2025-07-16',
                'jam_masuk'=>'06:45',
                'latitude'=>-6.9059770,
                'longitude'=>107.6131440,
                'foto_selfie'=>'absen_guru/1_20250716_in.jpg',
                'jam_pulang'=>'12:30',
                'status_id'=>1, // HADIR
                'keterangan'=>null,
                'jp_total'=>6,
            ],
        ]);
    }
}
