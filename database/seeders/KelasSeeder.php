<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KelasSeeder extends Seeder
{
    public function run(): void
    {
        $kelas = [];
        $jurusan = [1 => 'MPLB', 2 => 'TKR', 3 => 'TBSM'];
        
        // Buat kelas untuk setiap jurusan dan tingkat (hanya 1 rombel per tingkat)
        $guru_index = 1;
        foreach ($jurusan as $jurusan_id => $kode) {
            for ($tingkat = 10; $tingkat <= 12; $tingkat++) {
                $kelas[] = [
                    'nama' => "{$tingkat} {$kode} 1", // Format: 10 MPLB 1, 11 TKR 1, dst
                    'tingkat' => $tingkat,
                    'jurusan_id' => $jurusan_id,
                    'wali_guru_id' => $guru_index <= 5 ? $guru_index : null, // Guru 1-5 jadi wali kelas
                ];
                $guru_index++;
            }
        }

        DB::table('kelas')->insert($kelas);
    }
}
