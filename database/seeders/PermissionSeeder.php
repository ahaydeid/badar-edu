<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Dashboard
            'dashboard.view',

            // Hari Ini
            'absensi_guru.view',
            'kelas-berlangsung.view',

            // Pengumuman
            'pengumuman.view',
            'pengumuman.manage',

            // Jadwal & Absensi Guru Mapel
            'jadwal-mapel.view',
            'absensi-siswa.view',

            // Kelas Binaan
            'kelas-binaan.jadwal.view',
            'kelas-binaan.absensi.view',
            'kelas-binaan.absensi.detail',
            'kelas-binaan.progres.view',
            'kelas-binaan.siswa.view',
            'kelas-binaan.siswa.detail',
            'kelas-binaan.rapor.view',

            // Kalender Akademik
            'kalender-akademik.view',

            // Jadwal Semua Kelas
            'jadwal-semua-kelas.view',

            // LMS
            'lms.materi.view',
            'lms.tugas.view',

            // Rencana Ajar


            // Nilai/Penilaian
            'nilai.view',

            // Pengguna

            'guru-pegawai.view',
            'siswa.view',
            'rfid.register.view',

            // Master Data

            'master-data.guru.view',
            'master-data.siswa.view',
            'master-data.jadwal-ajar.view',
            'master-data.rombel.view',
            'master-data.alumni.view',

            // PPDB
            'ppdb.settings.view',
            'ppdb.pendaftaran.view',
            'ppdb.verifikasi.view',
            'ppdb.daftarulang.view',

            // Payroll

            'payroll.run',
            'payroll.slip',

            // Konfigurasi

            'konfigurasi.jadwal.view',
            'konfigurasi.kalender-akademik.view',
            'konfigurasi.jurusan.view',
            'konfigurasi.mapel.view',
            'konfigurasi.role.view',
            'konfigurasi.role.edit',

            // Kedisiplinan
            'kedisiplinan.view',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }
    }
}
