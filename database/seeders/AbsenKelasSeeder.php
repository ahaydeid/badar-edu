<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AbsenKelasSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('absen_kelas')->insert([
            [
                'id'=>1,
                'jadwal_id'=>1,
                'jam_masuk'=>'07:00',
                'jam_pulang'=>'12:00',
                'tanggal'=>'2025-07-16',
                'status_id'=>1, // HADIR
                'keterangan'=>null,
            ],
        ]);
    }
}
