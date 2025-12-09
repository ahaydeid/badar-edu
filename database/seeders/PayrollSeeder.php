<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PayrollSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('payroll')->insert([
            [
                'id'=>1,
                'user_id'=>1,
                'bulan'=>7,
                'tahun'=>2025,
                'gaji_pokok'=>5000000,
                'tunjangan'=>1000000,
                'potongan'=>500000,
                'total'=>5500000,
                'status'=>'FINAL',
            ],
        ]);
    }
}
