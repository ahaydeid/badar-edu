<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class SiswaSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $siswa = [];
        
        // 9 kelas x 10 siswa = 90 siswa
        for ($kelas_id = 1; $kelas_id <= 9; $kelas_id++) {
            for ($i = 1; $i <= 10; $i++) {
                $jk = $faker->randomElement(['L', 'P']);
                $nama = $jk === 'L' ? $faker->firstNameMale() . ' ' . $faker->lastName() : $faker->firstNameFemale() . ' ' . $faker->lastName();
                
                $siswa[] = [
                    'nama' => $nama,
                    'nipd' => $faker->unique()->numerify('####'),
                    'nisn' => $faker->unique()->numerify('##########'),
                    'jenis_kelamin' => $jk,
                    'tempat_lahir' => $faker->city(),
                    'tanggal_lahir' => $faker->dateTimeBetween('-18 years', '-15 years')->format('Y-m-d'),
                    'nik' => $faker->numerify('################'),
                    'agama' => $faker->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha']),
                    'alamat' => $faker->address(),
                    'rt' => $faker->numerify('0##'),
                    'rw' => $faker->numerify('0##'),
                    'kelurahan' => $faker->city(),
                    'kecamatan' => $faker->city(),
                    'rombel_saat_ini' => $kelas_id,
                    'hp' => $faker->phoneNumber(),
                ];
            }
        }

        // Insert dalam batch untuk performa
        foreach (array_chunk($siswa, 100) as $chunk) {
            DB::table('siswa')->insert($chunk);
        }
    }
}
