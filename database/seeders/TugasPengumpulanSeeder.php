<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TugasPengumpulanSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tugas_pengumpulan')->insert([
            [
                'id'=>1,
                'tugas_id'=>1,
                'siswa_id'=>1,
                'file_url'=>'tugas/1_andi.pdf',
                'nilai'=>95.0,
                'catatan'=>'Sangat baik.',
            ],
        ]);
    }
}
