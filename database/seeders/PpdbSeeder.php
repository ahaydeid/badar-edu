<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use App\Models\Pendaftar;
use App\Models\PpdbJurusanKuota;
use App\Models\PpdbPeriod;
use App\Models\PpdbUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PpdbSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate tables to allow re-seeding
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        PpdbUser::truncate();
        PpdbPeriod::truncate();
        Pendaftar::truncate();
        PpdbJurusanKuota::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // 1. Create Past Period (History)
        $pastPeriod = PpdbPeriod::create([
            'tahun_ajaran' => '2024/2025',
            'gelombang' => 'Gelombang 1',
            'start_date' => '2024-06-01',
            'end_date' => '2024-06-30',
            'status' => 'Tutup',
            'deskripsi' => 'PPDB Tahun Lalu',
        ]);

        // 2. Create Active Period
        $activePeriod = PpdbPeriod::create([
            'tahun_ajaran' => '2025/2026',
            'gelombang' => 'Gelombang 1',
            'start_date' => '2025-06-01',
            'end_date' => '2025-06-30',
            'status' => 'Aktif',
            'deskripsi' => 'PPDB Tahun Ajaran Baru',
        ]);

        // 3. Set Quotas for Active Period
        $jurusans = Jurusan::all();
        foreach ($jurusans as $jurusan) {
            PpdbJurusanKuota::create([
                'ppdb_period_id' => $activePeriod->id,
                'jurusan_id' => $jurusan->id,
                'kuota' => 60,
                'terisi' => 0, // Will recalculate later or let code handle it, but for seeding 0 is start
            ]);
            
            // Also for past period just for completeness
            PpdbJurusanKuota::create([
                'ppdb_period_id' => $pastPeriod->id,
                'jurusan_id' => $jurusan->id,
                'kuota' => 60,
                'terisi' => 60,
            ]);
        }

        // 4. Create Dummy Candidates (PpdbUser + Pendaftar)
        $statuses = ['Menunggu Verifikasi', 'Perlu Perbaikan', 'Terverifikasi', 'Diterima', 'Cadangan', 'Ditolak'];
        
        for ($i = 1; $i <= 20; $i++) {
            $user = PpdbUser::create([
                'email' => "calon{$i}@example.com",
                'password' => Hash::make('password123'),
                'nama_lengkap' => "Calon Siswa {$i}",
                'no_hp' => '0812345678' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'is_verified' => true,
                'email_verified_at' => now(),
            ]);

            $selectedJurusan = $jurusans->random();
            $status = $statuses[array_rand($statuses)];

            // Create Pendaftar
            Pendaftar::create([
                'ppdb_user_id' => $user->id,
                'ppdb_period_id' => $activePeriod->id,
                'jurusan_id' => $selectedJurusan->id,
                'no_pendaftaran' => 'PPDB-2025-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'status' => $status,
                // Biodata
                'nama_lengkap' => $user->nama_lengkap,
                'jenis_kelamin' => $i % 2 == 0 ? 'L' : 'P',
                'nisn' => '00' . rand(10000000, 99999999),
                'nik' => '32' . rand(10000000000000, 99999999999999),
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2010-01-01',
                'agama' => 'Islam',
                'alamat_jalan' => 'Jl. Contoh No. ' . $i,
                'desa_kelurahan' => 'Desa Contoh',
                'kecamatan' => 'Kecamatan Contoh',
                'kota_kabupaten' => 'Kota Bandung',
                'provinsi' => 'Jawa Barat',
                'kode_pos' => '40000',
                'no_hp_siswa' => $user->no_hp,
                'asal_sekolah' => 'SMP Negeri ' . rand(1, 10) . ' Bandung',
                'nama_ayah' => 'Ayah Calon ' . $i,
                'pekerjaan_ayah' => 'Wiraswasta',
                'no_hp_ayah' => '0811111111',
                'nama_ibu' => 'Ibu Calon ' . $i,
                'pekerjaan_ibu' => 'Ibu Rumah Tangga',
                'no_hp_ibu' => '0822222222',
                // 'penghasilan_ortu' => '2.000.000 - 4.999.999', // Removed as not in schema
                // Dokumen (dummy paths)
                // 'dokumen_kk' => 'dummy/kk.pdf',
            ]);

            // Update quota count if status is relevant (though usually handled by event/observer/logic)
            // For now just manually increment pivot for realism in seeded data
             $pivot = PpdbJurusanKuota::where('ppdb_period_id', $activePeriod->id)
                ->where('jurusan_id', $selectedJurusan->id)
                ->first();
             if ($pivot) {
                 $pivot->increment('terisi');
             }
        }
    }
}
