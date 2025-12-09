<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class KelasSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('kelas')->insert([
            [
                'id'=>1,
                'nama'=>'X RPL 1',
                'tingkat'=>10,
                'jurusan_id'=>1,
                'wali_guru_id'=>1,
            ],
        ]);
    }
}
