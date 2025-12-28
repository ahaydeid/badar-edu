<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $allPermissions = [
            // Core
            'dashboard.view',
            'profile.view',
            'hari-ini.view',

            // Hari Ini
            'absensi_guru.view',
            'kelas-berlangsung.view',

            // Pengumuman
            'pengumuman.view',
            'pengumuman.manage',

            // Akademik (granular)
            'jadwal-mapel.view',
            'absensi-siswa.view',
            'kelas-binaan.view',
            'kalender-akademik.view',
            'rencana-ajar.view',
            'lms-materi.view',
            'lms-tugas.view',

            // Khusus admin (akademik)
            'jadwal-semua-kelas.view',

            // Nilai
            'nilai.view',

            // Pengguna
            'pengguna.view',
            'guru-pegawai.view',
            'siswa.view',
            'rfid.register.view',

            // Master Data
            'master-data.view',
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
            'payroll.view',
            'payroll.run',
            'payroll.slip',

            // Konfigurasi
            'konfigurasi.view',
            'konfigurasi.jurusan.view',
            'konfigurasi.mapel.view',
            'konfigurasi.jadwal.view',
            'konfigurasi.kalender-akademik.view',
            'konfigurasi.role.view',
        ];

        foreach ($allPermissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $superadmin = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $guru = Role::firstOrCreate(['name' => 'guru', 'guard_name' => 'web']);

        $superadmin->syncPermissions(Permission::query()->pluck('name')->all());

        $admin->syncPermissions([
            // Akademik admin
            'kalender-akademik.view',
            'jadwal-semua-kelas.view',

            // PPDB
            'ppdb.settings.view',
            'ppdb.pendaftaran.view',
            'ppdb.verifikasi.view',
            'ppdb.daftarulang.view',

            // Payroll
            'payroll.view',
            'payroll.run',
            'payroll.slip',

            // Pengguna
            'pengguna.view',
            'guru-pegawai.view',
            'siswa.view',
            'rfid.register.view',

            // Master Data
            'master-data.view',
            'master-data.guru.view',
            'master-data.siswa.view',
            'master-data.jadwal-ajar.view',
            'master-data.rombel.view',
            'master-data.alumni.view',

            // Konfigurasi
            'konfigurasi.view',
            'konfigurasi.jurusan.view',
            'konfigurasi.mapel.view',
            'konfigurasi.jadwal.view',
            'konfigurasi.kalender-akademik.view',
            'konfigurasi.role.view',
        ]);

        $guru->syncPermissions([
            'jadwal-mapel.view',
            'absensi-siswa.view',
            'kelas-binaan.view',
            'kalender-akademik.view',
            'rencana-ajar.view',
            'lms-materi.view',
            'lms-tugas.view',

            // Nilai
            'nilai.view',
        ]);
    }
}
