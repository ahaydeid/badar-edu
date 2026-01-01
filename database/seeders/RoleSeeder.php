<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $superadmin = Role::firstOrCreate(['name' => 'devhero', 'guard_name' => 'web']);
        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $guru = Role::firstOrCreate(['name' => 'Guru', 'guard_name' => 'web']);
        $waliKelas = Role::firstOrCreate(['name' => 'Wali Kelas', 'guard_name' => 'web']);
        $siswa = Role::firstOrCreate(['name' => 'Siswa', 'guard_name' => 'web']);
        $kurikulum = Role::firstOrCreate(['name' => 'Kurikulum', 'guard_name' => 'web']);
        $kesiswaan = Role::firstOrCreate(['name' => 'Kesiswaan', 'guard_name' => 'web']);
        $tataUsaha = Role::firstOrCreate(['name' => 'Tata Usaha', 'guard_name' => 'web']);

        // Super Admin: semua permission (untuk developer/IT)
        // $superadmin->givePermissionTo(Permission::all()); // BYPASS via AuthServiceProvider

        // Admin: semua permission
        $admin->givePermissionTo(Permission::all());

        // Guru: permission untuk mengajar
        $guru->givePermissionTo([
            'dashboard.view',
            'jadwal-mapel.view',
            'absensi-siswa.view',
            'nilai.view',
            'pengumuman.view',
            'kalender-akademik.view',
            'lms.materi.view',
            'lms.tugas.view',

        ]);

        // Wali Kelas: Hanya permission kelas binaan (asumsi sudah punya role Guru)
        $waliKelas->givePermissionTo([

            'kelas-binaan.jadwal.view',
            'kelas-binaan.absensi.view',
            'kelas-binaan.absensi.detail',
            'kelas-binaan.progres.view',
            'kelas-binaan.siswa.view',
            'kelas-binaan.siswa.detail',
            'kelas-binaan.rapor.view',
        ]);

        // Siswa: permission terbatas
        $siswa->givePermissionTo([
            'dashboard.view',
            'pengumuman.view',
            'kalender-akademik.view',
            'lms.materi.view',
            'lms.tugas.view',
        ]);

        // Kurikulum: permission untuk manajemen akademik
        $kurikulum->givePermissionTo([
            'dashboard.view',
            'pengumuman.view',
            'pengumuman.manage',
            'kalender-akademik.view',
            'jadwal-semua-kelas.view',

            'master-data.guru.view',
            'master-data.siswa.view',
            'master-data.jadwal-ajar.view',
            'master-data.rombel.view',

            'konfigurasi.jadwal.view',
            'konfigurasi.kalender-akademik.view',
            'konfigurasi.jurusan.view',
            'konfigurasi.mapel.view',
        ]);

        // Kesiswaan: permission untuk kedisiplinan & PPDB
        $kesiswaan->givePermissionTo([
            'dashboard.view',
            'pengumuman.view',
            'pengumuman.manage',

            'master-data.siswa.view',
            'kedisiplinan.view',
            'ppdb.settings.view',
            'ppdb.pendaftaran.view',
            'ppdb.verifikasi.view',
            'ppdb.daftarulang.view',
        ]);

        // Tata Usaha: permission untuk pengguna & payroll

        $tataUsaha->givePermissionTo([
            'dashboard.view',
            'pengumuman.view',

            'guru-pegawai.view',
            'siswa.view',
            'rfid.register.view',

            'payroll.run',
            'payroll.slip',
        ]);
    }
}
