<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AbsenJpDetailSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('absen_jp_detail')->insert([
            [
                'id'=>1,
                'absen_jp_id'=>1,
                'jenis_absen_id'=>1, // HADIR
                'jumlah'=>1,
            ],
            [
                'id'=>2,
                'absen_jp_id'=>2,
                'jenis_absen_id'=>2, // TERLAMBAT
                'jumlah'=>1,
            ],
        ]);
    }
}
