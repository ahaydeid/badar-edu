<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ModulAjarSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('modul_ajar')->insert([
            [
                'id'=>1,
                'guru_id'=>1,
                'mapel_id'=>1,
                'kelas_id'=>1,
                'judul'=>'Modul Matematika X RPL 1',
                'jenis_modul'=>'RPP',
                'file_url'=>'modul/matematika_x_rpl1.pdf',
                'deskripsi'=>'Modul ajar matematika kelas X RPL 1 semester ganjil.',
            ],
        ]);
    }
}
