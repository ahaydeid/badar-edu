<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // MASTER DASAR
            HariSeeder::class,
            JamSeeder::class,
            GuruSeeder::class,
            PegawaiSeeder::class,
            SemesterSeeder::class,
            JenisAbsenSeeder::class,
            SiswaSeeder::class,

            // MASTER YANG BERGANTUNG
            JurusanSeeder::class,
            KegiatanTahunanSeeder::class,
            KegiatanKhususSeeder::class,
            KelasSeeder::class,
            MapelSeeder::class,
            WaliSiswaSeeder::class,

            // AUTH & RBAC
            UsersSeeder::class,
            RolesSeeder::class,
            PermissionsSeeder::class,
            PermissionRoleSeeder::class,
            RoleUserSeeder::class,
            RfidCardSeeder::class,

            // PAYROLL
            PayrollSeeder::class,
            PayrollSlipSeeder::class,

            // JADWAL & PENGAJARAN
            GuruMapelSeeder::class,
            JadwalSeeder::class,
            JadwalSiswaSeeder::class,
            ModulAjarSeeder::class,
            TugasSeeder::class,
            TugasPengumpulanSeeder::class,

            // ABSENSI (TIDAK ADA SEEDER → TABLE KOSONG, BIARKAN)
            AbsenKelasSeeder::class,
            PengajuanAbsenSiswaSeeder::class,
            IzinSakitSiswaSeeder::class,
            AbsenJpSeeder::class,
            AbsenJpTemporarySeeder::class,
            AbsenJpDetailSeeder::class,
            AbsenGuruSeeder::class,
            PengajuanAbsenGuruSeeder::class,

            // KEDISIPLINAN
            KedisiplinanSiswaSeeder::class,
        ]);
    }
}
