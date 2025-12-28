<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
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

            // Akademik
            'jadwal-mapel.view',
            'absensi-siswa.view',
            'nilai.view',
            'kelas-binaan.view',
            'kalender-akademik.view',
            'rencana-ajar.view',
            'lms-materi.view',
            'lms-tugas.view',
            'jadwal-semua-kelas.view',

            // Pengguna / Akun
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

            // Kedisiplinan
            'kedisiplinan.view',

            // Konfigurasi
            'konfigurasi.jurusan.view',
            'konfigurasi.mapel.view',
            'konfigurasi.jadwal.view',
            'konfigurasi.kalender-akademik.view',
            'konfigurasi.role.view',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate([
                'name' => $name,
                'guard_name' => 'web',
            ]);
        }

        $superadmin = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $guru = Role::firstOrCreate(['name' => 'guru', 'guard_name' => 'web']);

        // SUPERADMIN: semua permission
        $superadmin->syncPermissions(Permission::pluck('name')->all());

        // ADMIN
        $admin->syncPermissions([
            'dashboard.view',
            'profile.view',

            'pengumuman.view',
            'pengumuman.manage',

            'kalender-akademik.view',
            'jadwal-semua-kelas.view',

            'pengguna.view',
            'guru-pegawai.view',
            'siswa.view',
            'rfid.register.view',

            'master-data.view',
            'master-data.guru.view',
            'master-data.siswa.view',
            'master-data.jadwal-ajar.view',
            'master-data.rombel.view',
            'master-data.alumni.view',

            'ppdb.settings.view',
            'ppdb.pendaftaran.view',
            'ppdb.verifikasi.view',
            'ppdb.daftarulang.view',

            'payroll.view',
            'payroll.run',
            'payroll.slip',

            'kedisiplinan.view',

            'konfigurasi.jurusan.view',
            'konfigurasi.mapel.view',
            'konfigurasi.jadwal.view',
            'konfigurasi.kalender-akademik.view',
            'konfigurasi.role.view',
        ]);

        // GURU
        $guru->syncPermissions([
            'dashboard.view',
            'profile.view',

            'jadwal-mapel.view',
            'absensi-siswa.view',
            'kelas-binaan.view',
            'kalender-akademik.view',
            'rencana-ajar.view',
            'lms-materi.view',
            'lms-tugas.view',

            'nilai.view',
        ]);

        // Assign role contoh (opsional)
        if ($user = \App\Models\User::find(1)) {
            $user->assignRole('superadmin');
        }
        if ($user = \App\Models\User::find(2)) {
            $user->assignRole('guru');
        }
    }
}
