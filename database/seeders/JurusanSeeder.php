<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JurusanSeeder extends Seeder
{
    public function run(): void
    {
        $jurusan = [
            [
                'nama' => 'Manajemen Perkantoran dan Layanan Bisnis',
                'kode' => 'MPLB',
                'deskripsi' => 'Jurusan yang mempelajari administrasi perkantoran, manajemen bisnis, dan layanan pelanggan',
                'kepala_program_id' => null, // akan diisi setelah guru dibuat
            ],
            [
                'nama' => 'Teknik Kendaraan Ringan',
                'kode' => 'TKR',
                'deskripsi' => 'Jurusan yang fokus pada pemeliharaan dan perbaikan mobil atau kendaraan roda empat',
                'kepala_program_id' => null,
            ],
            [
                'nama' => 'Teknik dan Bisnis Sepeda Motor',
                'kode' => 'TBSM',
                'deskripsi' => 'Jurusan yang fokus pada spesialisasi teknis dan manajemen bengkel sepeda motor',
                'kepala_program_id' => null,
            ],
        ];

        DB::table('jurusan')->insert($jurusan);
    }
}
