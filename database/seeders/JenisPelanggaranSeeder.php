<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisPelanggaranSeeder extends Seeder
{
    public function run(): void
    {
        $jenisPelanggaran = [
            // Pelanggaran Ringan (1-10 poin)
            ['nama' => 'Terlambat masuk kelas', 'poin' => 5, 'aktif' => true],
            ['nama' => 'Tidak mengerjakan PR', 'poin' => 3, 'aktif' => true],
            ['nama' => 'Tidak memakai atribut lengkap', 'poin' => 5, 'aktif' => true],
            ['nama' => 'Rambut tidak rapi', 'poin' => 5, 'aktif' => true],
            ['nama' => 'Tidak membawa buku pelajaran', 'poin' => 3, 'aktif' => true],
            
            // Pelanggaran Sedang (11-30 poin)
            ['nama' => 'Bolos pelajaran', 'poin' => 15, 'aktif' => true],
            ['nama' => 'Merokok di lingkungan sekolah', 'poin' => 25, 'aktif' => true],
            ['nama' => 'Berkelahi dengan teman', 'poin' => 30, 'aktif' => true],
            ['nama' => 'Membawa HP saat pelajaran', 'poin' => 10, 'aktif' => true],
            ['nama' => 'Tidak mengikuti upacara', 'poin' => 10, 'aktif' => true],
            
            // Pelanggaran Berat (31-100 poin)
            ['nama' => 'Membawa senjata tajam', 'poin' => 100, 'aktif' => true],
            ['nama' => 'Narkoba', 'poin' => 100, 'aktif' => true],
            ['nama' => 'Mencuri', 'poin' => 50, 'aktif' => true],
            ['nama' => 'Merusak fasilitas sekolah', 'poin' => 40, 'aktif' => true],
            ['nama' => 'Melawan guru', 'poin' => 50, 'aktif' => true],
        ];

        DB::table('jenis_pelanggaran')->insert($jenisPelanggaran);
    }
}
