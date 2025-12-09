<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class JamSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('jam')->insert([
            ['id'=>1,'nama'=>'JP1','jam_mulai'=>'07:00','jam_selesai'=>'07:45','jumlah_jp'=>1],
            ['id'=>2,'nama'=>'JP2','jam_mulai'=>'07:45','jam_selesai'=>'08:30','jumlah_jp'=>1],
        ]);
    }
}
