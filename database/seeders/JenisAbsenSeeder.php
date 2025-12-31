<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisAbsenSeeder extends Seeder
{
    public function run(): void
    {
        $jenisAbsen = [
            ['kode' => 'H', 'nama' => 'Hadir', 'kategori' => 'HADIR', 'status' => 'ACTIVE'],
            ['kode' => 'I', 'nama' => 'Izin', 'kategori' => 'IZIN', 'status' => 'ACTIVE'],
            ['kode' => 'S', 'nama' => 'Sakit', 'kategori' => 'SAKIT', 'status' => 'ACTIVE'],
            ['kode' => 'A', 'nama' => 'Alpha', 'kategori' => 'ALPHA', 'status' => 'ACTIVE'],
            ['kode' => 'T', 'nama' => 'Terlambat', 'kategori' => 'TERLAMBAT', 'status' => 'ACTIVE'],
            ['kode' => 'TAP', 'nama' => 'Tanpa Keterangan', 'kategori' => 'TAP', 'status' => 'ACTIVE'],
            ['kode' => 'D', 'nama' => 'Dispensasi', 'kategori' => 'DISPENSASI', 'status' => 'ACTIVE'],
        ];

        DB::table('jenis_absen')->insert($jenisAbsen);
    }
}
