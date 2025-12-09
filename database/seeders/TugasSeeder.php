<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TugasSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tugas')->insert([
            [
                'id'=>1,
                'guru_id'=>1,
                'mapel_id'=>1,
                'kelas_id'=>1,
                'judul'=>'Tugas Persamaan Linear',
                'deskripsi'=>'Kerjakan 10 soal persamaan linear.',
                'file_url'=>null,
                'deadline'=>'2025-07-20 23:59:00',
            ],
        ]);
    }
}
