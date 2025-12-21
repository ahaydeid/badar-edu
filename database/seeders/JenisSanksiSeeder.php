<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisSanksiSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('jenis_sanksi')->insert([
            [
                'kode' => 'BK',
                'nama' => 'Pembinaan BK',
                'level' => 0,
                'min_poin' => 50,
                'durasi_hari' => 14,
                'keterangan' => 'Pembinaan oleh guru BK',
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'ORTU',
                'nama' => 'Pemanggilan Orang Tua',
                'level' => 0,
                'min_poin' => 75,
                'durasi_hari' => 0,
                'keterangan' => 'Pemanggilan orang tua/wali ke sekolah',
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'SP-1',
                'nama' => 'Surat Peringatan 1',
                'level' => 1,
                'min_poin' => 100,
                'durasi_hari' => 90,
                'keterangan' => 'Surat peringatan pertama',
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'SP-2',
                'nama' => 'Surat Peringatan 2',
                'level' => 2,
                'min_poin' => 150,
                'durasi_hari' => 90,
                'keterangan' => 'Surat peringatan kedua',
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'SP-3',
                'nama' => 'Surat Peringatan 3',
                'level' => 3,
                'min_poin' => 200,
                'durasi_hari' => 90,
                'keterangan' => 'Surat peringatan ketiga',
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
