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
            'absensi_guru.report.view',
            'kelas-berlangsung.view',

            // Pengumuman
            'pengumuman.view',
            'pengumuman.manage',

            // Jadwal & Absensi Guru Mapel
            'jadwal-mapel.view',
            'absensi-siswa.view',
            'absensi-siswa.manage',

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
            'rencana-ajar.view',
            'rencana-ajar.manage',

            // Nilai/Penilaian
            'nilai.view',
            'nilai.manage',

            // Pengguna (Akun)
            'guru-pegawai.view',
            'guru-pegawai.manage',
            'siswa.view',
            'siswa.manage',
            'rfid.register.view',
            'rfid.register.manage',

            // Master Data
            'master-data.guru.view',
            'master-data.guru.manage',
            'master-data.siswa.view',
            'master-data.siswa.manage',
            'master-data.jadwal-ajar.view',
            'master-data.jadwal-ajar.manage',
            'master-data.rombel.view',
            'master-data.rombel.manage',
            'master-data.alumni.view',
            'master-data.alumni.manage',

            // PPDB
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

            // Payroll
            'payroll.view',
            'payroll.run',
            'payroll.slip',

            // Konfigurasi
            'konfigurasi.view',
            'konfigurasi.manage',
            'konfigurasi.profil-sekolah.view',
            'konfigurasi.profil-sekolah.manage',
            'konfigurasi.titik-absen.view',
            'konfigurasi.titik-absen.manage',
            'konfigurasi.jadwal.view',
            'konfigurasi.jadwal.manage',
            'konfigurasi.kalender-akademik.view',
            'konfigurasi.kalender-akademik.manage',
            'konfigurasi.jurusan.view',
            'konfigurasi.jurusan.manage',
            'konfigurasi.mapel.view',
            'konfigurasi.mapel.manage',
            'konfigurasi.role.view',
            'konfigurasi.role.edit',
            'konfigurasi.role.manage',
            'konfigurasi.master-data-config.view',
            'konfigurasi.master-data-config.manage',

            // Kedisiplinan
            'kedisiplinan.view',
            'kedisiplinan.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
    }
}
