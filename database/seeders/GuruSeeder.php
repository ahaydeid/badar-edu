<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GuruSeeder extends Seeder
{
    public function run(): void
    {
        $guruData = [
            // List 2 (NIK Source) combined with List 1 (TMT/Other info)
            ['nama' => 'HAMBALI', 'nik' => '3603011502850002', 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1985-02-15', 'nuptk' => '8343765667130003', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd.I', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Agama Islam', 'tmt_kerja' => '2008-03-05', 'mengajar' => 'Pendidikan Agama Islam', 'kompetensi' => 'Pendidikan Agama Islam'],
            ['nama' => 'EVA OCVIYANTI', 'nik' => '3603015406850021', 'jk' => 'P', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1985-06-14', 'nuptk' => '8338765667130273', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Bahasa Indonesia', 'tmt_kerja' => '2012-09-16', 'tugas_tambahan' => 'Wakil Kepala Sekolah Siswa', 'mengajar' => 'Bahasa Indonesia', 'kompetensi' => 'Bahasa Indonesia'],
            ['nama' => 'NAILAN INDAH BESTARI', 'nik' => '1104084207970001', 'jk' => 'P', 'tempat_lahir' => 'B.ACEH', 'tanggal_lahir' => '1997-07-02', 'nuptk' => '0933766667130273', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'SE', 'jenjang' => 'S1', 'prodi' => 'Akutansi', 'tmt_kerja' => '2014-07-14', 'mengajar' => 'Manajemen Perkantoran', 'kompetensi' => 'Akutansi'],
            ['nama' => 'RIAN PUTRA PERDANA', 'nik' => '3515081106890001', 'jk' => 'L', 'tempat_lahir' => 'NGANJUK', 'tanggal_lahir' => '1989-06-11', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => null, 'jenjang' => 'SMA / sederajat', 'prodi' => 'Umum', 'tmt_kerja' => '2024-01-01', 'mengajar' => null, 'kompetensi' => null],
            ['nama' => 'MAYA KUSMIATI', 'nik' => '3603014806840003', 'jk' => 'P', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '1984-06-08', 'nuptk' => '4843765667130232', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd.I', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Agama Islam', 'tmt_kerja' => '2014-03-01', 'mengajar' => 'Pendidikan Agama Islam', 'kompetensi' => 'Pendidikan Agama Islam'],
            ['nama' => 'SAMSUL HUARIP', 'nik' => '3603012505810017', 'jk' => 'L', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '1981-05-25', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => null, 'jenjang' => 'SMA / sederajat', 'prodi' => 'Umum', 'tmt_kerja' => '2024-01-01', 'mengajar' => null, 'kompetensi' => null],
            ['nama' => 'INDRAYANI HIDAYAT', 'nik' => '3173014506870003', 'jk' => 'P', 'tempat_lahir' => 'JAKARTA', 'tanggal_lahir' => '1987-06-15', 'nuptk' => '5233775675130182', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Kom', 'jenjang' => 'S1', 'prodi' => 'Sistem Informasi', 'tmt_kerja' => '2013-09-15', 'tugas_tambahan' => 'Wakil Kepala Sekolah Kurikulum', 'mengajar' => 'Informatika', 'kompetensi' => 'Teknik Informatika'],
            ['nama' => 'Rina Haafizoh . PS', 'nik' => '3601142206680005', 'jk' => 'P', 'tempat_lahir' => 'TANGGAMUS', 'tanggal_lahir' => '1968-06-22', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Bahasa Inggris', 'tmt_kerja' => '2010-07-17', 'mengajar' => 'Bahasa Inggris', 'kompetensi' => 'Pendidikan Bahasa Inggris'],
            ['nama' => 'MUHAMAD BAGUS RIZKI PAJAR', 'nik' => '3603223004020003', 'jk' => 'L', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '2002-04-30', 'nuptk' => null, 'jenis_ptk' => 'Tenaga Kependidikan', 'gelar_belakang' => null, 'jenjang' => 'SMA / sederajat', 'prodi' => 'Ilmu Pengetahuan Sosial (IPS)', 'tmt_kerja' => '2024-10-04', 'mengajar' => null, 'kompetensi' => null],
            ['nama' => 'AYATI', 'nik' => '3603017004850004', 'jk' => 'P', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '1985-04-30', 'nuptk' => '8342774675130272', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Ekonomi', 'tmt_kerja' => '2012-01-15', 'mengajar' => 'Manajemen Perkantoran', 'kompetensi' => 'Pendidikan Ekonomi'],
            ['nama' => 'MAMAN FATHURRAHMAN', 'nik' => '3603222004830002', 'jk' => 'L', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '1983-04-20', 'nuptk' => '0447771672130182', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Psikologi Pendidikan', 'tmt_kerja' => '2017-07-14', 'mengajar' => 'BP/BK', 'kompetensi' => 'Bimbingan dan Konseling'],
            ['nama' => 'Moh. Arif Hidayatullah', 'nik' => '3603011310870003', 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1987-10-13', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => null, 'jenjang' => 'SMA / sederajat', 'prodi' => 'Akutansi', 'tmt_kerja' => '2024-07-16', 'tugas_tambahan' => 'Kepala Laboratorium', 'mengajar' => null, 'kompetensi' => 'Teknik Informatika'],
            ['nama' => 'MUHAMAD RIZKI PAWUZI', 'nik' => '3674040403910007', 'jk' => 'L', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '1991-03-04', 'nuptk' => '8536766667130252', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Pancasila dan Kewarganegaraan', 'tmt_kerja' => '2013-07-16', 'mengajar' => 'Pendidikan Pancasila', 'kompetensi' => 'PKN'],
            ['nama' => 'SYAHRONI', 'nik' => '3603012505780002', 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1978-05-25', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.T', 'jenjang' => 'S1', 'prodi' => 'Teknik Elektro', 'tmt_kerja' => '2023-01-07', 'tugas_tambahan' => 'Kepala Program Keahlian', 'mengajar' => 'BP/BK', 'kompetensi' => 'Mekanik Otomotif'],
            ['nama' => 'NURHAYATI', 'nik' => '3603015007910035', 'jk' => 'P', 'tempat_lahir' => 'INDRAMAYU', 'tanggal_lahir' => '1991-07-10', 'nuptk' => '8533766667130253', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'SE', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Bahasa', 'tmt_kerja' => '2014-07-16', 'mengajar' => 'Manajemen Perkantoran', 'kompetensi' => 'Pendidikan Ekonomi'],
            ['nama' => 'AYUNAH', 'nik' => '3603015102810007', 'jk' => 'P', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '1981-02-21', 'nuptk' => '0633765666130262', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Ekonomi', 'tmt_kerja' => '2014-07-14', 'mengajar' => 'Manajemen Perkantoran', 'kompetensi' => 'Pendidikan Ekonomi'],
            ['nama' => 'AHMAD IKHSAN FIRDAUS', 'nik' => '3603011004030033', 'jk' => 'L', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '2003-04-10', 'nuptk' => null, 'jenis_ptk' => 'Tenaga Kependidikan', 'gelar_belakang' => null, 'jenjang' => 'SMA / sederajat', 'prodi' => 'Administrasi Perkantoran', 'tmt_kerja' => '2022-01-07', 'mengajar' => null, 'kompetensi' => null],
            ['nama' => 'MOH. SARIF HIDAYATULLAH', 'nik' => '3603220511990007', 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1999-11-05', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => null, 'jenjang' => 'SMA / sederajat', 'prodi' => 'Umum', 'tmt_kerja' => '2024-01-01', 'mengajar' => null, 'kompetensi' => null],
            ['nama' => 'DUDY RUCHYAT', 'nik' => '3603012304850001', 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1985-04-23', 'nuptk' => '8233777673130312', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Kom', 'jenjang' => 'S1', 'prodi' => 'Teknik Informatika', 'tmt_kerja' => '2010-07-11', 'tugas_tambahan' => 'Wakil Kepala Sekolah Humas', 'mengajar' => 'Informatika', 'kompetensi' => 'TIK'],
            ['nama' => 'MOHAMAD ABDUL ROHIM', 'nik' => '3603012505860005', 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1986-05-25', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'SMA / sederajat', 'prodi' => 'Ilmu Pengetahuan Alam (IPA)', 'tmt_kerja' => '2014-01-01', 'mengajar' => 'BP/BK', 'kompetensi' => null],
            ['nama' => 'GUSTI ARIO GALANG MARHAENDRA', 'nik' => '3603130309860007', 'jk' => 'L', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '1986-09-03', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Pancasila dan Kewarganegaraan', 'tmt_kerja' => '2013-07-16', 'mengajar' => 'Pendidikan Pancasila', 'kompetensi' => 'Hukum'],
            ['nama' => 'ALVIAN PRIHATNO', 'nik' => '3603272811850005', 'jk' => 'L', 'tempat_lahir' => 'BOGOR', 'tanggal_lahir' => '1985-11-28', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'SMA / sederajat', 'prodi' => 'Ilmu Pengetahuan Alam (IPA)', 'tmt_kerja' => '2013-07-16', 'mengajar' => 'Matematika', 'kompetensi' => null],
            ['nama' => 'ANIZA SARI', 'nik' => '3603015710870003', 'jk' => 'P', 'tempat_lahir' => 'PADANG', 'tanggal_lahir' => '1987-10-17', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Si', 'jenjang' => 'S1', 'prodi' => 'Kimia', 'tmt_kerja' => '2013-05-25', 'mengajar' => null, 'kompetensi' => 'Kimia'],
            ['nama' => 'KAMALUDIN', 'nik' => '3603012104890003', 'jk' => 'L', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '1989-04-21', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Kom', 'jenjang' => 'SMA / sederajat', 'prodi' => 'Teknik Informatika', 'tmt_kerja' => '2013-07-16', 'mengajar' => 'Sejarah', 'kompetensi' => null],
            ['nama' => 'RAHMADAN AKBAR', 'nik' => '3603181004930012', 'jk' => 'L', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '1993-04-10', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => null, 'jenjang' => 'SMA / sederajat', 'prodi' => 'Umum', 'tmt_kerja' => '2024-01-01', 'mengajar' => null, 'kompetensi' => null],
            ['nama' => 'ANGGITA', 'nik' => '3603220401800005', 'jk' => 'L', 'tempat_lahir' => 'TANGERANG', 'tanggal_lahir' => '1980-01-04', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.T', 'jenjang' => 'S1', 'prodi' => 'Teknologi Kepelautan', 'tmt_kerja' => '2017-07-03', 'mengajar' => null, 'kompetensi' => 'Fisika Teknik'],
            
            // From List 1 but not in List 2 (NIK list)
            ['nama' => 'ABDUL KHOLIK (GURU)', 'nik' => null, 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1985-04-07', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Bahasa Arab', 'tmt_kerja' => '2022-04-15', 'mengajar' => 'Pendidikan Pancasila', 'kompetensi' => null],
            ['nama' => 'Adam Lukman', 'nik' => null, 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '2007-07-17', 'nuptk' => null, 'jenis_ptk' => 'Tenaga Kependidikan', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'SMA / sederajat', 'prodi' => 'Ilmu Pengetahuan Sosial (IPS)', 'tmt_kerja' => '2024-10-04', 'mengajar' => null, 'kompetensi' => null],
            ['nama' => 'Ahmad Arif Saepudin', 'nik' => null, 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1983-05-20', 'nuptk' => '7342776679130322', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Administrasi Perkantoran', 'tmt_kerja' => '2013-01-07', 'mengajar' => null, 'kompetensi' => 'Administrasi Perkantoran'],
            ['nama' => 'Ahmad Rifa\'i', 'nik' => null, 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1985-03-16', 'nuptk' => '0048773674130082', 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd.I', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Agama Islam', 'tmt_kerja' => '2013-07-07', 'mengajar' => 'Pendidikan Agama Islam', 'kompetensi' => 'Pendidikan Agama Islam'],
            ['nama' => 'Burhanudin', 'nik' => null, 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '2003-01-07', 'nuptk' => null, 'jenis_ptk' => 'Tenaga Kependidikan', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'SMA / sederajat', 'prodi' => 'Mekanik Otomotif', 'tmt_kerja' => '2023-01-07', 'mengajar' => null, 'kompetensi' => null],
            ['nama' => 'Muhamad Bagja Belalaga', 'nik' => null, 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '2010-01-01', 'nuptk' => null, 'jenis_ptk' => 'Tenaga Kependidikan', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'SMA / sederajat', 'prodi' => 'Ilmu Pengetahuan Sosial (IPS)', 'tmt_kerja' => '2024-10-04', 'mengajar' => null, 'kompetensi' => null],
            ['nama' => 'Nurhasan', 'nik' => null, 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '2002-02-15', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Kom', 'jenjang' => 'S1', 'prodi' => 'TIK', 'tmt_kerja' => '2014-07-16', 'mengajar' => null, 'kompetensi' => 'TIK'],
            ['nama' => 'Siti Rodhiyah', 'nik' => null, 'jk' => 'P', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1981-11-23', 'nuptk' => '0941767668130232', 'jenis_ptk' => 'Tenaga Kependidikan', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Dasar', 'tmt_kerja' => '2007-07-07', 'mengajar' => null, 'kompetensi' => 'Pendidikan Dasar'],
            ['nama' => 'Suherli', 'nik' => null, 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1981-10-10', 'nuptk' => '5542758651130073', 'jenis_ptk' => 'Kepala Sekolah', 'gelar_belakang' => 'S.Pd', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Agama Islam', 'tmt_kerja' => '2019-07-15', 'tugas_tambahan' => 'Kepala Sekolah', 'mengajar' => null, 'kompetensi' => 'Pendidikan Agama Islam'],
            ['nama' => 'Ubaedillah', 'nik' => null, 'jk' => 'L', 'tempat_lahir' => 'Tangerang', 'tanggal_lahir' => '1971-08-01', 'nuptk' => null, 'jenis_ptk' => 'Guru', 'gelar_belakang' => 'S.Pd.I', 'jenjang' => 'S1', 'prodi' => 'Pendidikan Agama Islam', 'tmt_kerja' => '2008-07-03', 'mengajar' => null, 'kompetensi' => 'Pendidikan Agama Islam'],
        ];

        $counts = [];
        $finalData = [];

        foreach ($guruData as $data) {
            $tmt = date('ymd', strtotime($data['tmt_kerja']));
            if (!isset($counts[$tmt])) {
                $counts[$tmt] = 1;
            } else {
                $counts[$tmt]++;
            }
            
            $sequence = str_pad($counts[$tmt], 2, '0', STR_PAD_LEFT);
            $kodeGuru = "GR-" . $tmt . $sequence;

            $finalData[] = [
                'kode_guru' => $kodeGuru,
                'nama' => $data['nama'],
                'nuptk' => $data['nuptk'],
                'jk' => $data['jk'],
                'tempat_lahir' => $data['tempat_lahir'],
                'tanggal_lahir' => $data['tanggal_lahir'],
                'nik' => $data['nik'],
                'nip' => null,
                'status_kepegawaian' => 'GTY', 
                'jenis_ptk' => $data['jenis_ptk'],
                'gelar_depan' => null,
                'gelar_belakang' => $data['gelar_belakang'] ?? null,
                'jenjang' => $data['jenjang'],
                'prodi' => $data['prodi'],
                'sertifikasi' => null,
                'tmt_kerja' => $data['tmt_kerja'],
                'tugas_tambahan' => $data['tugas_tambahan'] ?? null,
                'mengajar' => $data['mengajar'] ?? null,
                'jam_tugas_tambahan' => null,
                'jjm' => 24,
                'total_jjm' => 24,
                'kompetensi' => $data['kompetensi'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Add Administrator
        $finalData[] = [
            'kode_guru' => 'GR-00000000',
            'nama' => 'Administrator',
            'nuptk' => null,
            'jk' => 'L',
            'tempat_lahir' => '-',
            'tanggal_lahir' => '2000-01-01',
            'nik' => null,
            'nip' => null,
            'status_kepegawaian' => 'Tetap',
            'jenis_ptk' => 'Tenaga Administrasi Sekolah',
            'gelar_depan' => null,
            'gelar_belakang' => null,
            'jenjang' => 'S1',
            'prodi' => 'Teknologi Informasi',
            'sertifikasi' => null,
            'tmt_kerja' => '2000-01-01',
            'tugas_tambahan' => 'Admin',
            'mengajar' => null,
            'jam_tugas_tambahan' => 0,
            'jjm' => 0,
            'total_jjm' => 0,
            'kompetensi' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('guru')->truncate();
        DB::table('guru')->insert($finalData);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
