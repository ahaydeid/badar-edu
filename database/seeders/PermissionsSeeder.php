<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('permissions')->insert([
            ['id'=>1,'name'=>'siswa.view','display_name'=>'Lihat Siswa','group_name'=>'master_siswa'],
            ['id'=>2,'name'=>'siswa.create','display_name'=>'Tambah Siswa','group_name'=>'master_siswa'],
            ['id'=>3,'name'=>'siswa.update','display_name'=>'Ubah Siswa','group_name'=>'master_siswa'],
            ['id'=>4,'name'=>'siswa.delete','display_name'=>'Hapus Siswa','group_name'=>'master_siswa'],
        ]);
    }
}
