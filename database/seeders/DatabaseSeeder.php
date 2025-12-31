<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // URUTAN PENTING! Harus sesuai dependency

        // 1. Permission & Roles (harus paling awal)
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
        ]);

        // 2. Master Data Tanpa FK
        $this->call([
            HariSeeder::class,
            JamSeeder::class,
            SemesterSeeder::class,
            JenisAbsenSeeder::class,
            JenisPelanggaranSeeder::class,
            JenisSanksiSeeder::class,
        ]);

        // 3. Data Guru & Jurusan
        $this->call([
            GuruSeeder::class,
            JurusanSeeder::class,
        ]);

        // 4. Mapel & Kelas (butuh jurusan)
        $this->call([
            MapelSeeder::class,
            KelasSeeder::class,
        ]);

        // 5. Siswa (butuh kelas)
        $this->call([
            SiswaSeeder::class,
        ]);

        // 6. Users (butuh guru & siswa)
        $this->call([
            UserSeeder::class,
        ]);

        // 7. Data Tambahan
        $this->call([
            PengumumanSeeder::class,
            KegiatanTahunanSeeder::class,
        ]);

        $this->command->info('✅ Seeding completed successfully!');
        $this->command->info('📊 Data yang dibuat:');
        $this->command->info('   - 60+ Permissions');
        $this->command->info('   - 8 Roles (Super Admin, Admin, Guru, Wali Kelas, Siswa, Kurikulum, Kesiswaan, Tata Usaha)');
        $this->command->info('   - 8 Guru (5 guru mapel + 3 staff)');
        $this->command->info('   - 3 Jurusan (MPLB, TKR, TBSM)');
        $this->command->info('   - 9 Kelas (3 jurusan x 3 tingkat)');
        $this->command->info('   - 16 Mapel');
        $this->command->info('   - 90 Siswa (10 per kelas)');
        $this->command->info('   - 23 Users');
        $this->command->info('');
        $this->command->info('🔑 Login credentials:');
        $this->command->info('   Super Admin: username=superadmin, password=passwordSUPER123');
        $this->command->info('   Admin: username=admin, password=passwordADMIN123');
        $this->command->info('   Guru: username=[kode_guru], password=password123 (contoh: GR-00011001)');
        $this->command->info('   Siswa: username=[nisn], password=password123');
        $this->command->info('   Staff: username=[kode_guru], password=password123 (GR-12070101, GR-13070101, GR-14070101)');
    }
}
