<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisPelanggaranSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('jenis_pelanggaran')->insert([
            [
                'nama' => 'Datang terlambat',
                'poin' => 5,
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Tidak memakai seragam lengkap',
                'poin' => 5,
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Bolos tanpa keterangan',
                'poin' => 25,
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Membawa HP saat jam pelajaran',
                'poin' => 10,
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Perkelahian',
                'poin' => 50,
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
