<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'id'=>1,
                'username'=>'admin',
                'password'=>Hash::make('password'),
                'profile_type'=>null,
                'profile_id'=>null,
                'status'=>'ACTIVE',
                'last_login'=>null,
            ],
            [
                'id'=>2,
                'username'=>'guru1',
                'password'=>Hash::make('password'),
                'profile_type'=>'GURU',
                'profile_id'=>1,
                'status'=>'ACTIVE',
                'last_login'=>null,
            ],
            [
                'id'=>3,
                'username'=>'siswa1',
                'password'=>Hash::make('password'),
                'profile_type'=>'SISWA',
                'profile_id'=>1,
                'status'=>'ACTIVE',
                'last_login'=>null,
            ],
        ]);
    }
}
