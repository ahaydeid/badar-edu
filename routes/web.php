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

// Kelas Binaan
use App\Http\Controllers\KelasBinaan\JadwalKelasController;
use App\Http\Controllers\KelasBinaan\DataSiswaController;
use App\Http\Controllers\KelasBinaan\AbsensiKelasController;

use App\Http\Controllers\JadwalGuruController;
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

use App\Http\Controllers\Kedisiplinan\KedisiplinanController;
use App\Http\Controllers\JadwalSemuaKelasController;

// AUTH
Route::get('/login', [LoginController::class, 'show'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/', fn () => Inertia::render('Home'));
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

    // HARI INI (sebelumnya cuma auth, sekarang pakai permission)
    Route::get('/hari-ini', $ud)
        ->middleware(['permission:hari-ini.view']);

    // PROFILE (sebelumnya cuma auth, sekarang pakai permission)
    Route::get('/profile', [ProfileController::class, 'index'])
        ->name('profile');

    // HARI INI (payung absensi_guru.view)
    Route::middleware(['permission:absensi.guru.view'])->group(function () {
        Route::get('/absensi-guru', [AbsensiGuruController::class, 'index']);
        Route::get('/kelas-berlangsung', [KelasBerlangsungController::class, 'index']);
    });

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

    // AKADEMIK UMUM (payung absen.siswa.view)
    Route::middleware(['permission:absen.siswa.view'])->group(function () use ($ud) {
        Route::get('/jadwal-mapel', [JadwalGuruController::class, 'index']);

        Route::get('/absensi-siswa', [AbsensiSiswaController::class, 'index']);
        Route::get('/absensi-siswa/{kelas}', [AbsensiSiswaController::class, 'kelas']);
        Route::get('/absensi-siswa/detail/{jadwal}/{siswa}', [AbsensiSiswaController::class, 'detail'])->name('absensi-siswa.detail');

        Route::prefix('kelas-binaan')->group(function () use ($ud) {
            Route::get('/jadwal-kelas', [JadwalKelasController::class, 'index']);
            Route::get('/absensi-siswa', [AbsensiKelasController::class, 'index']);
            Route::get('/absensi-siswa/detail/{siswa}', [AbsensiKelasController::class, 'detail']);
            Route::get('/progres-siswa', $ud);
            Route::get('/data-siswa', [DataSiswaController::class, 'index']);
            Route::get('/siswa/{id}', [SiswaController::class, 'show']);
            Route::get('/rapor-siswa', $ud);
        });

        Route::get('/kalender-akademik', [KalendarAkademikController::class, 'index']);

        Route::get('/jadwal-semua-kelas', [JadwalSemuaKelasController::class, 'index']);
        Route::get('/jadwal-semua-kelas/{kelas}', [JadwalSemuaKelasController::class, 'show']);

        Route::get('/lms-materi', $ud);
        Route::get('/lms-tugas', $ud);

        Route::prefix('rencana-ajar')->group(function () use ($ud) {
            Route::get('/', $ud);
            Route::get('/modul', $ud);
            Route::get('/silabus', $ud);
        });
    });

    // NILAI (pakai nilai.view)
    Route::middleware(['permission:nilai.view'])->group(function () {
        Route::get('/penilaian', [PenilaianController::class, 'index'])->name('penilaian.index');
        Route::get('/penilaian/{kelas}', [PenilaianController::class, 'detail'])->name('penilaian.detail');
        Route::get('/penilaian/{kelas}/{penilaian}', [PenilaianController::class, 'subPenilaian'])->name('penilaian.sub');
    });

    // PENGGUNA + MASTER DATA + PPDB + PAYROLL (pakai master.view)
    Route::middleware(['permission:master.view'])->group(function () use ($ud) {

        Route::get('/akun/guru-pegawai', [AkunGuruPegawaiController::class, 'index'])->name('guru-pegawai.index');
        Route::get('/akun/siswa', [AkunSiswaController::class, 'index'])->name('siswa.index');
        Route::get('/rfid', $ud);

        Route::prefix('master-data')->group(function () use ($ud) {
            Route::get('/', $ud);

            Route::get('/guru', [GuruController::class, 'index']);
            Route::get('/guru/{guru}', [GuruController::class, 'show']);
            Route::get('/guru/{guru}/edit', [GuruController::class, 'edit']);
            Route::post('/guru', [GuruController::class, 'store']);
            Route::put('/guru/{guru}', [GuruController::class, 'update']);
            Route::delete('/guru/{guru}', [GuruController::class, 'destroy']);

            Route::get('/siswa', [SiswaController::class, 'index'])->name('siswa.index');
            Route::get('/siswa/{id}', [SiswaController::class, 'show'])->name('siswa.show');
            Route::post('/siswa', [SiswaController::class, 'store'])->name('siswa.store');
            Route::get('/siswa/{id}/edit', [SiswaController::class, 'edit'])->name('siswa.edit');
            Route::put('/siswa/{id}', [SiswaController::class, 'update'])->name('siswa.update');
            Route::delete('/siswa/{id}', [SiswaController::class, 'destroy'])->name('siswa.destroy');

            Route::post('/siswa/import', [SiswaController::class, 'import'])->name('siswa.import');

            Route::get('/jadwal-ajar', [JadwalController::class, 'index'])->name('jadwal.index');
            Route::get('/rombel', [KelasController::class, 'index'])->name('kelas.index');

            Route::get('/alumni', $ud);
        });

        Route::prefix('ppdb')->name('ppdb.')->group(function () {
            Route::get('/pengaturan', [PengaturanController::class, 'index'])->name('pengaturan.index');
            Route::get('/pendaftaran', [PendaftaranController::class, 'index'])->name('pendaftaran.index');
            Route::get('/verifikasi', [VerifikasiController::class, 'index'])->name('verifikasi.index');
            Route::get('/daftar-ulang', [DaftarUlangController::class, 'index'])->name('daftarulang.index');
        });

        Route::prefix('payroll')->group(function () use ($ud) {
            Route::get('/', $ud);
            Route::get('/run', $ud);
            Route::get('/slip', $ud);
        });
    });

    // KONFIGURASI (pakai konfigurasi.view)
    Route::middleware(['permission:konfigurasi.view'])->group(function () use ($ud) {
        Route::prefix('konfigurasi')->group(function () use ($ud) {

            Route::prefix('jadwal')->group(function () use ($ud) {
                Route::get('/', $ud);
                Route::get('/hari', [HariController::class, 'index'])->name('hari.index');
                Route::get('/jam', [JamController::class, 'index'])->name('jam.index');
                Route::get('/semester', [SemesterController::class, 'index'])->name('semester.index');
            });

            Route::prefix('kalender-akademik')->group(function () use ($ud) {
                Route::get('/', $ud);
                Route::get('/giat-khusus', [KegiatanKhususController::class, 'index'])->name('kegiatan-khusus.index');
                Route::get('/giat-tahunan', [KegiatanTahunanController::class, 'index'])->name('kegiatan-tahunan.index');
            });

            Route::get('/jurusan', [JurusanController::class, 'index'])->name('jurusan.index');
            Route::get('/mapel', [MapelController::class, 'index'])->name('mapel.index');
            Route::get('/titik-absen', $ud);
            Route::get('/role', [RoleController::class, 'index'])->name('role.index');
        });
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
