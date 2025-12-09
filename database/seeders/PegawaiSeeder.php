<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PegawaiSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pegawai')->insert([
            [
                'id'=>1,
                'nama'=>'Admin TU',
                'nip'=>null,
                'jabatan'=>'Tata Usaha',
                'jk'=>'L',
                'tempat_lahir'=>'Bandung',
                'tanggal_lahir'=>'1990-01-01',
                'status_kepegawaian'=>'Honorer',
                'nomor_hp'=>'081200000001',
                'alamat'=>'Jl. Kantor No. 1',
            ],
        ]);
    }
}
