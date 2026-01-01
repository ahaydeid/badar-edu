<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolSetting;

class SchoolSettingSeeder extends Seeder
{
    public function run()
    {
        $settings = [
            'school_name' => 'SMK Badar Suites',
            'school_address' => 'Jl. Pendidikan No. 123, Kabupaten Badar',
            'school_phone' => '(021) 1234567 | Website: www.smkbadar.sch.id',
            'school_logo' => null, // Will use default placeholder if null
            'kop_surat_title' => 'BUKTI DAFTAR ULANG SISWA BARU',
        ];

        foreach ($settings as $key => $value) {
            SchoolSetting::updateOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $value]
            );
        }
    }
}
