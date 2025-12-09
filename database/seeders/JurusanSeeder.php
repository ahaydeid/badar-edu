<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class JurusanSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('jurusan')->insert([
            [
                'id'=>1,
                'nama'=>'Rekayasa Perangkat Lunak',
                'kode'=>'RPL',
                'deskripsi'=>'Program keahlian Rekayasa Perangkat Lunak',
                'kepala_program_id'=>1,
            ],
        ]);
    }
}
