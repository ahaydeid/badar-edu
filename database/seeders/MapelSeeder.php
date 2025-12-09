<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MapelSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('mapel')->insert([
            [
                'id'=>1,
                'kode_mapel'=>'MTK-X',
                'nama'=>'Matematika',
                'kategori'=>'WAJIB',
                'tingkat'=>10,
                'jurusan_id'=>1,
                'warna_hex_mapel'=>'#FF5722',
            ],
        ]);
    }
}
