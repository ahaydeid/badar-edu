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

        // Create roles with dashboard_type
        $superadmin = Role::updateOrCreate(['name' => 'devhero', 'guard_name' => 'web'], ['dashboard_type' => 'admin']);
        $admin      = Role::updateOrCreate(['name' => 'Admin', 'guard_name' => 'web'], ['dashboard_type' => 'admin']);
        $guru       = Role::updateOrCreate(['name' => 'Guru', 'guard_name' => 'web'], ['dashboard_type' => 'guru_mapel']);
        $waliKelas  = Role::updateOrCreate(['name' => 'Wali Kelas', 'guard_name' => 'web'], ['dashboard_type' => 'wali_kelas']);
        $siswa      = Role::updateOrCreate(['name' => 'Siswa', 'guard_name' => 'web'], ['dashboard_type' => 'admin']); // Not used in web
        $kurikulum  = Role::updateOrCreate(['name' => 'Kurikulum', 'guard_name' => 'web'], ['dashboard_type' => 'admin']);
        $kesiswaan  = Role::updateOrCreate(['name' => 'Kesiswaan', 'guard_name' => 'web'], ['dashboard_type' => 'staff']);
        $tataUsaha  = Role::updateOrCreate(['name' => 'Tata Usaha', 'guard_name' => 'web'], ['dashboard_type' => 'staff']);

        // Super Admin: semua permission (untuk developer/IT)
        // $superadmin->givePermissionTo(Permission::all()); // BYPASS via AuthServiceProvider

        // Admin: semua permission
        $admin->givePermissionTo(Permission::all());

        // Guru: permission untuk mengajar
        $guru->givePermissionTo([
            'dashboard.view',
            'jadwal-mapel.view',
            'absensi-siswa.view',
            'absensi-siswa.manage',
            'nilai.view',
            'nilai.manage',
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
            'master-data.guru.manage',
            'master-data.siswa.view',
            'master-data.siswa.manage',
            'master-data.jadwal-ajar.view',
            'master-data.jadwal-ajar.manage',
            'master-data.rombel.view',
            'master-data.rombel.manage',

            'konfigurasi.jadwal.view',
            'konfigurasi.jadwal.manage',
            'konfigurasi.kalender-akademik.view',
            'konfigurasi.kalender-akademik.manage',
            'konfigurasi.jurusan.view',
            'konfigurasi.jurusan.manage',
            'konfigurasi.mapel.view',
            'konfigurasi.mapel.manage',
        ]);

        // Kesiswaan: permission untuk kedisiplinan & PPDB
        $kesiswaan->givePermissionTo([
            'dashboard.view',
            'pengumuman.view',
            'pengumuman.manage',

            'master-data.siswa.view',
            'master-data.siswa.manage',
            'kedisiplinan.view',
            'kedisiplinan.manage',
            'ppdb.settings.view',
            'ppdb.settings.manage',
            'ppdb.pendaftaran.view',
            'ppdb.pendaftaran.manage',
            'ppdb.verifikasi.view',
            'ppdb.verifikasi.manage',
            'ppdb.daftarulang.view',
            'ppdb.daftarulang.manage',
            'ppdb.siswabaru.view',
            'ppdb.siswabaru.manage',
        ]);

        // Tata Usaha: permission untuk pengguna & payroll

        $tataUsaha->givePermissionTo([
            'dashboard.view',
            'pengumuman.view',

            'guru-pegawai.view',
            'guru-pegawai.manage',
            'siswa.view',
            'siswa.manage',
            'rfid.register.view',
            'rfid.register.manage',

            'payroll.view',
            'payroll.run',
            'payroll.slip',
        ]);
    }
}
