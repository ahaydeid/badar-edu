<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AbsenJpTemporarySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('absen_jp_temporary')->insert([
            [
                'id'=>1,
                'jadwal_id'=>1,
                'siswa_id'=>1,
                'jam_masuk'=>'07:00',
                'tanggal'=>'2025-07-16',
                'terlambat'=>0,
                'status_id'=>1, // HADIR
                'status_absen'=>'SELESAI',
            ],
            [
                'id'=>2,
                'jadwal_id'=>1,
                'siswa_id'=>2,
                'jam_masuk'=>'07:15',
                'tanggal'=>'2025-07-16',
                'terlambat'=>15,
                'status_id'=>2, // TERLAMBAT
                'status_absen'=>'SELESAI',
            ],
        ]);
    }
}
