<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PengajuanAbsenSiswaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pengajuan_absen_siswa')->insert([
            [
                'id'=>1,
                'jadwal_id'=>1,
                'siswa_id'=>2,
                'tanggal'=>'2025-07-16',
                'status_id'=>3, // SAKIT
                'bukti'=>'bukti/surat_dokter_bunga.pdf',
                'alasan'=>'Demam tinggi',
                'status_pengajuan'=>'DITERIMA',
            ],
        ]);
    }
}
