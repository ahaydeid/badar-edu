<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisSanksiSeeder extends Seeder
{
    public function run(): void
    {
        $jenisSanksi = [
            [
                'kode' => 'SP1',
                'nama' => 'Surat Peringatan 1',
                'level' => 1,
                'min_poin' => 25,
                'durasi_hari' => 30,
                'keterangan' => 'Peringatan pertama untuk siswa yang melakukan pelanggaran',
                'aktif' => true,
            ],
            [
                'kode' => 'SP2',
                'nama' => 'Surat Peringatan 2',
                'level' => 2,
                'min_poin' => 50,
                'durasi_hari' => 60,
                'keterangan' => 'Peringatan kedua, orang tua dipanggil ke sekolah',
                'aktif' => true,
            ],
            [
                'kode' => 'SP3',
                'nama' => 'Surat Peringatan 3',
                'level' => 3,
                'min_poin' => 75,
                'durasi_hari' => 90,
                'keterangan' => 'Peringatan ketiga, siswa terancam skorsing',
                'aktif' => true,
            ],
            [
                'kode' => 'SKORS',
                'nama' => 'Skorsing',
                'level' => 4,
                'min_poin' => 100,
                'durasi_hari' => 7,
                'keterangan' => 'Siswa tidak boleh masuk sekolah selama 7 hari',
                'aktif' => true,
            ],
            [
                'kode' => 'DO',
                'nama' => 'Drop Out (Dikeluarkan)',
                'level' => 5,
                'min_poin' => 150,
                'durasi_hari' => 0,
                'keterangan' => 'Siswa dikeluarkan dari sekolah',
                'aktif' => true,
            ],
        ];

        DB::table('jenis_sanksi')->insert($jenisSanksi);
    }
}
