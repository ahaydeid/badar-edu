<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class HariSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('hari')->insert([
            ['id'=>1,'nama'=>'Senin','hari_ke'=>1],
            ['id'=>2,'nama'=>'Selasa','hari_ke'=>2],
            ['id'=>3,'nama'=>'Rabu','hari_ke'=>3],
            ['id'=>4,'nama'=>'Kamis','hari_ke'=>4],
            ['id'=>5,'nama'=>'Jumat','hari_ke'=>5],
            ['id'=>6,'nama'=>'Sabtu','hari_ke'=>6],
            ['id'=>7,'nama'=>'Minggu','hari_ke'=>7],
        ]);
    }
}
