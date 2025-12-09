<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PayrollSlipSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('payroll_slip')->insert([
            [
                'id'=>1,
                'payroll_id'=>1,
                'file_url'=>'payroll/slip_1.pdf',
            ],
        ]);
    }
}
