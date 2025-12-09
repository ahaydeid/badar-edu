<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RoleUserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('role_user')->insert([
            ['user_id'=>1,'role_id'=>1],
            ['user_id'=>2,'role_id'=>2],
            ['user_id'=>3,'role_id'=>3],
        ]);
    }
}
