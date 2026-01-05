<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Guru;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Create Admin
        $adminGuru = Guru::where('kode_guru', 'GR-00000000')->first();
        $admin = User::updateOrCreate(
            ['username' => 'admin'],
            [
                'password' => Hash::make('passwordADMIN123'),
                'profile_type' => 'App\Models\Guru',
                'profile_id' => $adminGuru?->id,
            ]
        );
        $admin->assignRole('Admin');

        // 2. Create DevHero
        $devhero = User::updateOrCreate(
            ['username' => 'devhero'],
            [
                'password' => Hash::make('passwordDEV123'),
                'profile_type' => null,
                'profile_id' => null,
            ]
        );
        $devhero->assignRole('devhero');

        // 3. Create Users for all Gurus from GuruSeeder
        $gurus = Guru::where('kode_guru', '!=', 'GR-00000000')->get();
        
        foreach ($gurus as $guru) {
            // Gunakan NIK sebagai password jika ada, jika tidak pakai template
            $password = $guru->nik ? $guru->nik : 'password123';

            $user = User::updateOrCreate(
                ['username' => $guru->kode_guru],
                [
                    'password' => Hash::make($password),
                    'profile_type' => 'App\Models\Guru',
                    'profile_id' => $guru->id,
                ]
            );
            
            // Assign role based on jenis_ptk
            if (str_contains(strtolower($guru->jenis_ptk), 'guru') || str_contains(strtolower($guru->jenis_ptk), 'kepala sekolah')) {
                $user->assignRole('Guru');
            } else {
                // If it's staff, maybe assign Guru role for now or a Staff role if exists
                $user->assignRole('Guru'); 
            }
        }
    }
}
