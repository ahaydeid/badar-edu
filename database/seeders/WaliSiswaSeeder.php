<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class WaliSiswaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('wali_siswa')->insert([
            [
                'id'=>1,
                'siswa_id'=>1,
                'jenis_wali'=>'AYAH',
                'nama'=>'Rahmat',
                'tahun_lahir'=>1980,
                'jenjang_pendidikan'=>'SMA',
                'pekerjaan'=>'Karyawan Swasta',
                'penghasilan'=>'5.000.000',
                'nik'=>'3210010201800001',
            ],
            [
                'id'=>2,
                'siswa_id'=>2,
                'jenis_wali'=>'AYAH',
                'nama'=>'Joko',
                'tahun_lahir'=>1982,
                'jenjang_pendidikan'=>'SMA',
                'pekerjaan'=>'Wiraswasta',
                'penghasilan'=>'6.000.000',
                'nik'=>'3210010201800002',
            ],
        ]);
    }
}
