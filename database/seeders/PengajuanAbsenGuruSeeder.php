<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PengajuanAbsenGuruSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pengajuan_absen_guru')->insert([
            [
                'id'=>1,
                'jadwal_id'=>1,
                'guru_id'=>2,
                'tanggal'=>'2025-07-17',
                'status_id'=>4, // IZIN
                'alasan'=>'Mengikuti diklat',
                'status_pengajuan'=>'DITERIMA',
                'keterangan'=>'Dinas luar 1 hari',
            ],
        ]);
    }
}
