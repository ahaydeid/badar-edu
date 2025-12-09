<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class GuruMapelSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('guru_mapel')->insert([
            [
                'id'=>1,
                'guru_id'=>1,
                'mapel_id'=>1,
                'semester_id'=>1,
                'status'=>'ACTIVE',
            ],
        ]);
    }
}
