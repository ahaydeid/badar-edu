<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            ['id'=>1,'name'=>'admin','display_name'=>'Administrator','description'=>'Full access'],
            ['id'=>2,'name'=>'guru','display_name'=>'Guru','description'=>'Akses guru'],
            ['id'=>3,'name'=>'siswa','display_name'=>'Siswa','description'=>'Akses siswa'],
        ]);
    }
}
