<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RfidCardSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('rfid_card')->insert([
            [
                'id'=>1,
                'nomor_kartu'=>'0001234567',
                'user_id'=>1,
                'status'=>'ACTIVE',
            ],
        ]);
    }
}
