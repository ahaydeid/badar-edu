<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class JenisAbsenSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('jenis_absen')->insert([
            ['id'=>1,'kode'=>'HADIR','nama'=>'Hadir','kategori'=>null,'status'=>'ACTIVE'],
            ['id'=>2,'kode'=>'TERLAMBAT','nama'=>'Terlambat','kategori'=>null,'status'=>'ACTIVE'],
            ['id'=>3,'kode'=>'SAKIT','nama'=>'Sakit','kategori'=>null,'status'=>'ACTIVE'],
            ['id'=>4,'kode'=>'IZIN','nama'=>'Izin','kategori'=>null,'status'=>'ACTIVE'],
            ['id'=>5,'kode'=>'ALFA','nama'=>'Alfa','kategori'=>null,'status'=>'ACTIVE'],
            ['id'=>6,'kode'=>'PULANG_CEPAT','nama'=>'Pulang Cepat','kategori'=>null,'status'=>'ACTIVE'],
        ]);
    }
}
