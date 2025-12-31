<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Guru;
use App\Models\Siswa;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // User Super Admin (untuk developer/IT) - DIHAPUS, pakai backdoor di LoginController
        // $superadmin = User::create([...]);

        // User untuk Guru & Staff (termasuk Admin)
        $gurus = Guru::all();
        foreach ($gurus as $index => $guru) {
            // Default credential
            $username = $guru->kode_guru;
            $password = 'password123';
            $roleName = 'Guru';

            // Custom logic untuk Administrator
            if ($guru->tugas_tambahan === 'Admin') {
                $username = 'admin';
                $password = 'passwordADMIN123';
                $roleName = 'Admin';
            }

            $user = User::create([
                'username' => $username,
                'password' => Hash::make($password),
                'profile_type' => 'App\Models\Guru',
                'profile_id' => $guru->id,
                'status' => 'ACTIVE',
            ]);
            
            // Assign Main Role
            $user->assignRole($roleName);

            // Logic tambahan role
            if ($guru->tugas_tambahan === 'Admin') {
                // Admin doesn't need extra roles logic here as it's set above
                continue; 
            }

            // Assign role tambahan berdasarkan tugas_tambahan lainnya
            if ($guru->tugas_tambahan === 'Kurikulum') {
                $user->assignRole('Kurikulum');
            } elseif ($guru->tugas_tambahan === 'Kesiswaan') {
                $user->assignRole('Kesiswaan');
            } elseif ($guru->tugas_tambahan === 'Tata Usaha') {
                $user->assignRole('Tata Usaha');
            } 
            
            // Wali Kelas logic
            $isWali = \App\Models\Kelas::where('wali_guru_id', $guru->id)->exists();
            if ($isWali) {
                $user->assignRole('Wali Kelas');
            }
        }

        // User untuk Siswa (hanya 10 siswa pertama untuk testing) - username pakai nisn
        $siswas = Siswa::limit(10)->get();
        foreach ($siswas as $siswa) {
            $user = User::create([
                'username' => $siswa->nisn, // Pakai NISN
                'password' => Hash::make('password123'),
                'profile_type' => 'App\Models\Siswa',
                'profile_id' => $siswa->id,
                'status' => 'ACTIVE',
            ]);
            $user->assignRole('Siswa');
        }
    }
}
