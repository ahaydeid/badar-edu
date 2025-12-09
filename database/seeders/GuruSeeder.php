<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class GuruSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('guru')->insert([
            [
                'id'=>1,
                'nama'=>'Budi Santoso',
                'nuptk'=>'1234567890',
                'jk'=>'L',
                'tempat_lahir'=>'Bandung',
                'tanggal_lahir'=>'1985-01-01',
                'nip'=>'198501012010011001',
                'status_kepegawaian'=>'PNS',
                'jenis_ptk'=>'Guru Mata Pelajaran',
                'gelar_depan'=>null,
                'gelar_belakang'=>'S.Pd',
                'jenjang'=>'S1',
                'prodi'=>'Pendidikan Matematika',
                'sertifikasi'=>'Matematika',
                'tmt_kerja'=>'2010-01-01',
                'tugas_tambahan'=>'Wali Kelas',
                'mengajar'=>'Matematika',
                'jam_tugas_tambahan'=>2,
                'jjm'=>24,
                'total_jjm'=>26,
                'kompetensi'=>'Matematika, Numerasi',
            ],
            [
                'id'=>2,
                'nama'=>'Siti Aminah',
                'nuptk'=>'1234567891',
                'jk'=>'P',
                'tempat_lahir'=>'Jakarta',
                'tanggal_lahir'=>'1987-03-10',
                'nip'=>null,
                'status_kepegawaian'=>'Honorer',
                'jenis_ptk'=>'Guru BK',
                'gelar_depan'=>null,
                'gelar_belakang'=>'S.Pd',
                'jenjang'=>'S1',
                'prodi'=>'Bimbingan Konseling',
                'sertifikasi'=>null,
                'tmt_kerja'=>'2015-07-01',
                'tugas_tambahan'=>null,
                'mengajar'=>'BK',
                'jam_tugas_tambahan'=>0,
                'jjm'=>12,
                'total_jjm'=>12,
                'kompetensi'=>'Konseling, Psikologi',
            ],
        ]);
    }
}
