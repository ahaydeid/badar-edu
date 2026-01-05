<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth
use App\Http\Controllers\Auth\LoginController;

// Profile
use App\Http\Controllers\ProfileController;

// Master Data
use App\Http\Controllers\MasterData\SiswaController;
use App\Http\Controllers\MasterData\GuruController;
use App\Http\Controllers\MasterData\JadwalController;
use App\Http\Controllers\MasterData\KelasController;

// Hari Ini
use App\Http\Controllers\HariIni\AbsensiGuruController;
use App\Http\Controllers\HariIni\KelasBerlangsungController;

// Guru Mapel
use App\Http\Controllers\GuruMapel\AbsensiSiswaController;
use App\Http\Controllers\GuruMapel\PenilaianController;
use App\Http\Controllers\GuruMapel\JadwalGuruController;

// Kelas Binaan
use App\Http\Controllers\KelasBinaan\JadwalKelasController;
use App\Http\Controllers\KelasBinaan\DataSiswaController;
use App\Http\Controllers\KelasBinaan\AbsensiKelasController;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\KalendarAkademikController;

// Akun
use App\Http\Controllers\Pengguna\AkunGuruPegawaiController;
use App\Http\Controllers\Pengguna\AkunSiswaController;

// PPDB
use App\Http\Controllers\PPDB\PengaturanController;
use App\Http\Controllers\PPDB\PendaftaranController;
use App\Http\Controllers\PPDB\VerifikasiController;
use App\Http\Controllers\PPDB\DaftarUlangController;

// Konfigurasi
use App\Http\Controllers\Konfigurasi\KalenderAkademik\KegiatanKhususController;
use App\Http\Controllers\Konfigurasi\KalenderAkademik\KegiatanTahunanController;
use App\Http\Controllers\Konfigurasi\Jadwal\HariController;
use App\Http\Controllers\Konfigurasi\Jadwal\JamController;
use App\Http\Controllers\Konfigurasi\Jadwal\SemesterController;
use App\Http\Controllers\Konfigurasi\MapelController;
use App\Http\Controllers\Konfigurasi\JurusanController;
use App\Http\Controllers\Konfigurasi\RoleController;
use App\Http\Controllers\Konfigurasi\SchoolProfileController;
use App\Http\Controllers\Konfigurasi\MasterDataConfigController;
use App\Http\Controllers\Konfigurasi\TitikAbsenController;

use App\Http\Controllers\Kedisiplinan\KedisiplinanController;
use App\Http\Controllers\JadwalSemuaKelasController;

// AUTH
Route::get('/login', [LoginController::class, 'show'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/', fn () => redirect('/dashboard'));
$ud = fn () => Inertia::render('UnderDevelopment');

/*
|--------------------------------------------------------------------------
| AUTH ONLY (SEMUA MENU DALAM APLIKASI WAJIB LOGIN)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () use ($ud) {

    // DASHBOARD
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware(['permission:dashboard.view'])
        ->name('dashboard');

    // PROFILE (sebelumnya cuma auth, sekarang pakai permission)
    Route::get('/profile', [ProfileController::class, 'index'])
        ->name('profile');

    // HARI INI (payung absensi_guru.view)
    Route::middleware(['permission:absensi_guru.view'])->group(function () {
        Route::get('/absensi-guru', [AbsensiGuruController::class, 'index']);
        Route::post('/absensi-guru/verify/{id}', [AbsensiGuruController::class, 'verify'])->name('absensi-guru.verify');
        });

        Route::get('/kelas-berlangsung', [KelasBerlangsungController::class, 'index'])
            ->middleware(['permission:kelas-berlangsung.view']);

    // PENGUMUMAN: view vs manage
    Route::prefix('pengumuman')->group(function () {
        Route::get('/', [PengumumanController::class, 'index'])
            ->middleware(['permission:pengumuman.view'])
            ->name('pengumuman.index');

        Route::get('/create', [PengumumanController::class, 'create'])
            ->middleware(['permission:pengumuman.manage'])
            ->name('pengumuman.create');

        Route::post('/', [PengumumanController::class, 'store'])
            ->middleware(['permission:pengumuman.manage'])
            ->name('pengumuman.store');

        Route::get('/{pengumuman}/edit', [PengumumanController::class, 'edit'])
            ->middleware(['permission:pengumuman.manage'])
            ->name('pengumuman.edit');

        Route::put('/{pengumuman}', [PengumumanController::class, 'update'])
            ->middleware(['permission:pengumuman.manage'])
            ->name('pengumuman.update');

        Route::delete('/{pengumuman}', [PengumumanController::class, 'destroy'])
            ->middleware(['permission:pengumuman.manage'])
            ->name('pengumuman.destroy');
    });

    Route::get('/jadwal-mapel', [JadwalGuruController::class, 'index'])
        ->middleware(['permission:jadwal-mapel.view']);

    Route::prefix('absensi-siswa')->middleware(['permission:absensi-siswa.view'])->group(function () {
        Route::get('/', [AbsensiSiswaController::class, 'index']);
        Route::get('/{kelas}', [AbsensiSiswaController::class, 'kelas']);
        Route::get('/detail/{jadwal}/{siswa}', [AbsensiSiswaController::class, 'detail'])->name('absensi-siswa.detail');
    });

    Route::prefix('kelas-binaan')->group(function () use ($ud) {
        Route::get('/jadwal-kelas', [JadwalKelasController::class, 'index'])
            ->middleware('permission:kelas-binaan.jadwal.view');
        Route::get('/absensi-siswa', [AbsensiKelasController::class, 'index'])
            ->middleware('permission:kelas-binaan.absensi.view');
        Route::get('/absensi-siswa/detail/{siswa}', [AbsensiKelasController::class, 'detail'])
            ->middleware('permission:kelas-binaan.absensi.detail');
        Route::get('/progres-siswa', $ud)
            ->middleware('permission:kelas-binaan.progres.view');
        Route::get('/data-siswa', [DataSiswaController::class, 'index'])
            ->middleware('permission:kelas-binaan.siswa.view');
        Route::get('/siswa/{id}', [SiswaController::class, 'show'])
            ->middleware('permission:kelas-binaan.siswa.detail');
        Route::get('/siswa/{id}/edit', [DataSiswaController::class, 'edit'])
            ->middleware('permission:kelas-binaan.siswa.view');
        Route::put('/siswa/{id}', [DataSiswaController::class, 'update'])
            ->middleware('permission:kelas-binaan.siswa.view');
        Route::get('/rapor-siswa', $ud)
            ->middleware('permission:kelas-binaan.rapor.view');
    });


    Route::get('/kalender-akademik', [KalendarAkademikController::class, 'index'])
        ->middleware(['permission:kalender-akademik.view']);

    Route::prefix('jadwal-semua-kelas')->middleware(['permission:jadwal-semua-kelas.view'])->group(function () {
        Route::get('/', [JadwalSemuaKelasController::class, 'index']);
        Route::get('/{kelas}', [JadwalSemuaKelasController::class, 'show']);
    });

    Route::get('/lms-materi', $ud)->middleware(['permission:lms.materi.view']);
    Route::get('/lms-tugas', $ud)->middleware(['permission:lms.tugas.view']);

    Route::prefix('rencana-ajar')->group(function () use ($ud) { // REMOVED permission:rencana-ajar.view
        Route::get('/', $ud);
        Route::get('/modul', $ud);
        Route::get('/silabus', $ud);
    });


    // NILAI (pakai nilai.view)
    Route::middleware(['permission:nilai.view'])->group(function () {
        Route::get('/penilaian', [PenilaianController::class, 'index'])->name('penilaian.index');
        
        Route::post('/penilaian', [PenilaianController::class, 'storeJenis'])->middleware(['permission:nilai.manage'])->name('penilaian.storeJenis');
        Route::post('/penilaian/sub', [PenilaianController::class, 'storeSub'])->middleware(['permission:nilai.manage'])->name('penilaian.storeSub');
        Route::post('/penilaian/nilai', [PenilaianController::class, 'updateNilai'])->middleware(['permission:nilai.manage'])->name('penilaian.updateNilai');
        Route::post('/penilaian/finish', [PenilaianController::class, 'finishSub'])->middleware(['permission:nilai.manage'])->name('penilaian.finishSub');
        Route::get('/penilaian/{kelasId}/hitung', [PenilaianController::class, 'hitungAkhir'])->name('penilaian.hitung');
        Route::post('/penilaian/bobot', [PenilaianController::class, 'simpanBobot'])->middleware(['permission:nilai.manage'])->name('penilaian.simpanBobot');
        Route::post('/penilaian/kirim-akhir', [PenilaianController::class, 'kirimNilaiAkhir'])->middleware(['permission:nilai.manage'])->name('penilaian.kirimAkhir');

        Route::get('/penilaian/{kelas}', [PenilaianController::class, 'detail'])->name('penilaian.detail');
        Route::get('/penilaian/{kelas}/{penilaian}', [PenilaianController::class, 'subPenilaian'])->name('penilaian.sub');

        Route::delete('/penilaian/{jenis}', [PenilaianController::class, 'destroyJenis'])->middleware(['permission:nilai.manage'])->name('penilaian.destroyJenis');
        Route::delete('/penilaian/sub/{sub}', [PenilaianController::class, 'destroySub'])->middleware(['permission:nilai.manage'])->name('penilaian.destroySub');
    });

    // PENGGUNA
    Route::middleware([])->group(function () use ($ud) { // REMOVED permission:pengguna.view
         Route::get('/akun/guru-pegawai', [AkunGuruPegawaiController::class, 'index'])
             ->middleware(['permission:guru-pegawai.view'])
             ->name('guru-pegawai.index');

         Route::put('/akun/guru-pegawai/{user}', [AkunGuruPegawaiController::class, 'update'])
             ->middleware(['permission:guru-pegawai.view'])
             ->name('akun.guru-pegawai.update');
         Route::post('/akun/store', [AkunGuruPegawaiController::class, 'store'])
             ->middleware(['permission:guru-pegawai.manage']) // Assuming manage permission exists or reuse view if loose
             ->name('akun.store');
             
         Route::delete('/akun/{user}', [AkunGuruPegawaiController::class, 'destroy'])
             ->middleware(['permission:guru-pegawai.manage'])
             ->name('akun.destroy');

         Route::post('/akun/{user}/reset-password', [AkunGuruPegawaiController::class, 'resetPassword'])
             ->middleware(['permission:guru-pegawai.manage'])
             ->name('akun.reset-password');

         Route::get('/akun/siswa', [AkunSiswaController::class, 'index'])
             ->middleware(['permission:siswa.view'])
             ->name('siswa.index');
         Route::get('/rfid', $ud)
             ->middleware(['permission:rfid.register.view']);
     });

     // MASTER DATA
     
     Route::prefix('master-data')
        // ->middleware(['permission:master-data.view']) // REMOVED
        ->group(function () use ($ud) {

            Route::get('/', $ud);

            Route::get('/guru', [GuruController::class, 'index'])
                ->middleware(['permission:master-data.guru.view']);
            Route::get('/guru/{guru}', [GuruController::class, 'show'])
                ->middleware(['permission:master-data.guru.view']);
            Route::get('/guru/{guru}/edit', [GuruController::class, 'edit'])
                ->middleware(['permission:master-data.guru.view']);
            Route::post('/guru', [GuruController::class, 'store'])
                ->middleware(['permission:master-data.guru.manage']);
            Route::put('/guru/{guru}', [GuruController::class, 'update'])
                ->middleware(['permission:master-data.guru.manage']);
            Route::delete('/guru/{guru}', [GuruController::class, 'destroy'])
                ->middleware(['permission:master-data.guru.manage']);

            Route::get('/siswa', [SiswaController::class, 'index'])
                ->middleware(['permission:master-data.siswa.view']);
            Route::get('/siswa/{id}', [SiswaController::class, 'show'])
                ->middleware(['permission:master-data.siswa.view']);
            Route::post('/siswa', [SiswaController::class, 'store'])
                ->middleware(['permission:master-data.siswa.manage']);
            Route::get('/siswa/{id}/edit', [SiswaController::class, 'edit'])
                ->middleware(['permission:master-data.siswa.view']);
            Route::put('/siswa/{id}', [SiswaController::class, 'update'])
                ->middleware(['permission:master-data.siswa.manage']);
            Route::delete('/siswa/{id}', [SiswaController::class, 'destroy'])
                ->middleware(['permission:master-data.siswa.manage']);

            Route::post('/siswa/import', [SiswaController::class, 'import'])
                ->middleware(['permission:master-data.siswa.manage']);

            Route::get('/jadwal-ajar', [JadwalController::class, 'index'])
                ->middleware(['permission:master-data.jadwal-ajar.view'])
                ->name('master-data.jadwal.index');

            Route::post('/jadwal-ajar/bulk-sync', [JadwalController::class, 'bulkSync'])
                ->middleware(['permission:master-data.jadwal-ajar.manage'])
                ->name('master-data.jadwal.bulk-sync');

            Route::delete('/jadwal-ajar/{jadwal}', [JadwalController::class, 'destroy'])
                ->middleware(['permission:master-data.jadwal-ajar.manage'])
                ->name('master-data.jadwal.destroy');

            Route::get('/rombel', [KelasController::class, 'index'])
                ->middleware(['permission:master-data.rombel.view']);

            Route::post('/rombel', [KelasController::class, 'store'])
                ->middleware(['permission:master-data.rombel.manage']);

            Route::put('/rombel/{id}', [KelasController::class, 'update'])
                ->middleware(['permission:master-data.rombel.manage']);

            Route::delete('/rombel/{id}', [KelasController::class, 'destroy'])
                ->middleware(['permission:master-data.rombel.manage']);


            Route::get('/alumni', $ud)
                ->middleware(['permission:master-data.alumni.view']);
        });


    // PPDB + PAYROLL (pakai master.view)
    Route::prefix('ppdb')->group(function () {
        Route::get('/pengaturan', [PengaturanController::class, 'index'])
            ->middleware(['permission:ppdb.settings.view']);
        Route::post('/pengaturan', [PengaturanController::class, 'store'])
            ->middleware(['permission:ppdb.settings.manage'])
            ->name('ppdb.pengaturan.store');
        Route::put('/pengaturan/{id}', [PengaturanController::class, 'update'])
            ->middleware(['permission:ppdb.settings.manage'])
            ->name('ppdb.pengaturan.update');
        Route::get('/pendaftaran', [PendaftaranController::class, 'index'])
            ->middleware(['permission:ppdb.pendaftaran.view']);
        Route::get('/pendaftaran/cetak/{id}', [PendaftaranController::class, 'cetak'])
             ->middleware(['permission:ppdb.pendaftaran.view'])
             ->name('ppdb.pendaftaran.cetak');
        Route::get('/verifikasi', [VerifikasiController::class, 'index'])
            ->middleware(['permission:ppdb.verifikasi.view']);
        Route::put('/verifikasi/{id}/status', [VerifikasiController::class, 'update'])
            ->middleware(['permission:ppdb.verifikasi.manage'])
            ->name('ppdb.verifikasi.update');
        Route::get('/daftar-ulang', [DaftarUlangController::class, 'index'])
            ->middleware(['permission:ppdb.daftarulang.view'])
            ->name('ppdb.daftarulang');
        Route::put('/daftar-ulang/{id}/complete', [DaftarUlangController::class, 'complete'])
            ->middleware(['permission:ppdb.daftarulang.manage'])
            ->name('ppdb.daftarulang.complete');
        Route::get('/cetak/{id}', [DaftarUlangController::class, 'cetak'])
            ->middleware(['permission:ppdb.daftarulang.view'])
            ->name('ppdb.cetak');
            
        Route::get('/siswa-baru', [\App\Http\Controllers\PPDB\SiswaBaruController::class, 'index'])
            ->middleware(['permission:ppdb.siswabaru.view'])
            ->name('ppdb.siswabaru');
        Route::post('/siswa-baru/bulk-migrate', [\App\Http\Controllers\PPDB\SiswaBaruController::class, 'bulkMigrate'])
            ->middleware(['permission:ppdb.siswabaru.manage'])
            ->name('ppdb.siswabaru.bulk-migrate');
    });

    Route::prefix('payroll')
        // ->middleware(['permission:payroll.view']) // REMOVED
        ->group(function () use ($ud) {

            Route::get('/run', $ud)
                ->middleware(['permission:payroll.run']);

            Route::get('/slip', $ud)
                ->middleware(['permission:payroll.slip']);
        });


    // KONFIGURASI (pakai konfigurasi.view)
   Route::prefix('konfigurasi')
    // ->middleware(['permission:konfigurasi.view']) // REMOVED
    ->group(function () use ($ud) {

        Route::prefix('jadwal')->group(function () use ($ud) {
            Route::get('/', $ud)->middleware(['permission:konfigurasi.jadwal.view']);
            Route::get('/hari', [HariController::class, 'index'])
                ->middleware(['permission:konfigurasi.jadwal.view']);
            Route::get('/jam', [JamController::class, 'index'])
                ->middleware(['permission:konfigurasi.jadwal.view']);
            Route::get('/semester', [SemesterController::class, 'index'])
                ->middleware(['permission:konfigurasi.jadwal.view']);
            
            Route::post('/semester', [SemesterController::class, 'store'])
                ->middleware(['permission:konfigurasi.jadwal.manage']);
            
            Route::put('/semester/{semester}', [SemesterController::class, 'update'])
                ->middleware(['permission:konfigurasi.jadwal.manage']);
        });

        Route::prefix('kalender-akademik')->group(function () use ($ud) {
            Route::get('/', $ud)
                ->middleware(['permission:konfigurasi.kalender-akademik.view']);
            Route::get('/giat-khusus', [KegiatanKhususController::class, 'index'])
                ->middleware(['permission:konfigurasi.kalender-akademik.view']);
            Route::get('/giat-tahunan', [KegiatanTahunanController::class, 'index'])
                ->middleware(['permission:konfigurasi.kalender-akademik.view']);
        });

        Route::get('/jurusan', [JurusanController::class, 'index'])
            ->middleware(['permission:konfigurasi.jurusan.view']);

        Route::get('/mapel', [MapelController::class, 'index'])
            ->middleware(['permission:konfigurasi.mapel.view'])
            ->name('konfigurasi.mapel.index');
        Route::post('/mapel', [MapelController::class, 'store'])
            ->middleware(['permission:konfigurasi.mapel.manage'])
            ->name('konfigurasi.mapel.store');
        Route::put('/mapel/{mapel}', [MapelController::class, 'update'])
            ->middleware(['permission:konfigurasi.mapel.manage'])
            ->name('konfigurasi.mapel.update');
        Route::delete('/mapel/{mapel}', [MapelController::class, 'destroy'])
            ->middleware(['permission:konfigurasi.mapel.manage'])
            ->name('konfigurasi.mapel.destroy');

        Route::get('/titik-absen', [TitikAbsenController::class, 'index'])
            ->middleware(['permission:konfigurasi.view'])->name('titik-absen.index');
        Route::post('/titik-absen', [TitikAbsenController::class, 'store'])
            ->middleware(['permission:konfigurasi.manage'])->name('titik-absen.store');
        Route::patch('/titik-absen/{id}', [TitikAbsenController::class, 'update'])
            ->middleware(['permission:konfigurasi.manage'])->name('titik-absen.update');
        Route::delete('/titik-absen/{id}', [TitikAbsenController::class, 'destroy'])
            ->middleware(['permission:konfigurasi.manage'])->name('titik-absen.destroy');

        // Konfigurasi Role
        Route::get('/role', [RoleController::class, 'index'])
            ->middleware(['permission:konfigurasi.role.view']);
        Route::post('/role', [RoleController::class, 'store'])
            ->middleware(['permission:konfigurasi.role.edit']);
        Route::get('/role/{role}/permissions', [RoleController::class, 'editPermissions'])
            ->middleware(['permission:konfigurasi.role.edit']);
        Route::post('/role/{role}/permissions', [RoleController::class, 'updatePermissions'])
            ->middleware(['permission:konfigurasi.role.edit']);

        // Master Data Config
        Route::get('/master-data', [MasterDataConfigController::class, 'index'])
            ->middleware(['permission:konfigurasi.master-data-config.view'])
            ->name('konfigurasi.master-data.index');
        Route::post('/master-data/{key}', [MasterDataConfigController::class, 'update'])
            ->middleware(['permission:konfigurasi.master-data-config.manage'])
            ->name('konfigurasi.master-data.update');

        // Profil Sekolah
        Route::get('/profile-sekolah', [SchoolProfileController::class, 'index'])
            ->middleware(['permission:konfigurasi.view'])
            ->name('konfigurasi.profile');
        Route::post('/profile-sekolah', [SchoolProfileController::class, 'update'])
            ->middleware(['permission:konfigurasi.manage'])
            ->name('konfigurasi.profile.update');
    });


    // KEDISIPLINAN (sebelumnya cuma auth, sekarang pakai permission)
    Route::middleware(['permission:kedisiplinan.view'])
        ->prefix('kedisiplinan')
        ->name('kedisiplinan.')
        ->group(function () {
            Route::get('/', [KedisiplinanController::class, 'dashboard'])->name('dashboard');
            Route::get('/perlu-tindakan', [KedisiplinanController::class, 'perluTindakan'])->name('perlu-tindakan');
            Route::get('/siswa', [KedisiplinanController::class, 'siswaIndex'])->name('siswa.index');
            Route::get('/siswa/{siswa}', [KedisiplinanController::class, 'siswaShow'])->name('siswa.show');
            Route::get('/riwayat-sanksi', [KedisiplinanController::class, 'riwayatSanksi'])->name('riwayat-sanksi');
            Route::prefix('master')->name('master.')->group(function () {
                Route::get('/jenis-pelanggaran', [KedisiplinanController::class, 'jenisPelanggaranIndex'])->name('jenis-pelanggaran.index');
                Route::get('/jenis-sanksi', [KedisiplinanController::class, 'jenisSanksiIndex'])->name('jenis-sanksi.index');
            });
        });
});
