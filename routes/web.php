<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MasterData\SiswaController;
use App\Http\Controllers\MasterData\GuruController;
use App\Http\Controllers\AbsensiGuruController;
use App\Http\Controllers\KalendarAkademikController;
use App\Http\Controllers\JadwalKelasController;
use App\Http\Controllers\JadwalGuruController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\MasterData\JadwalController;
use App\Http\Controllers\MasterData\KelasController;
use App\Http\Controllers\Konfigurasi\KalenderAkademik\KegiatanKhususController;
use App\Http\Controllers\Konfigurasi\KalenderAkademik\KegiatanTahunanController;
use App\Http\Controllers\Konfigurasi\Jadwal\HariController;
use App\Http\Controllers\Konfigurasi\Jadwal\JamController;
use App\Http\Controllers\Konfigurasi\Jadwal\SemesterController;
use App\Http\Controllers\Konfigurasi\MapelController;
use App\Http\Controllers\Konfigurasi\JurusanController;
use App\Http\Controllers\Konfigurasi\RoleController;
use App\Http\Controllers\Kedisiplinan\KedisiplinanController;



Route::get('/', fn() => Inertia::render('Home'));
$ud = fn() => Inertia::render('UnderDevelopment');


// DASHBOARD

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');
Route::get('/hari-ini', $ud);


// HARI INI
Route::get('/absensi-guru', [AbsensiGuruController::class, 'index']);
Route::get('/kelas-berlangsung', fn() => Inertia::render('Hari-Ini/Kelas-Berlangsung/Index'));


// PENGUMUMAN
Route::prefix('pengumuman')->group(function () {
    Route::get('/', [PengumumanController::class, 'index'])->name('pengumuman.index');
    Route::get('/create', [PengumumanController::class, 'create'])->name('pengumuman.create');
    Route::post('/', [PengumumanController::class, 'store'])->name('pengumuman.store');
    Route::get('/{pengumuman}/edit', [PengumumanController::class, 'edit'])->name('pengumuman.edit');
    Route::put('/{pengumuman}', [PengumumanController::class, 'update'])->name('pengumuman.update');
    Route::delete('/{pengumuman}', [PengumumanController::class, 'destroy'])->name('pengumuman.destroy');
});


// AKADEMIK: ABSEN SISWA
Route::prefix('absensi-siswa')->group(function () use ($ud) {
    Route::get('/', $ud);
    Route::get('/detail', $ud);
});


// AKADEMIK: KELAS BINAAN
Route::prefix('kelas-binaan')->group(function () use ($ud) {
    Route::get('/jadwal-kelas', [JadwalKelasController::class, 'index']);
    Route::get('/absensi', $ud);
    Route::get('/data-siswa', [SiswaController::class, 'index']);
    Route::get('/siswa/{id}', [SiswaController::class, 'show']);
    Route::get('/rapor-siswa', $ud);
});


Route::get('/jadwal-mapel', [JadwalGuruController::class, 'index']);


// AKADEMIK: TUGAS


// AKADEMIK: MODUL AJAR
Route::prefix('modul-ajar')->group(function () use ($ud) {
    Route::get('/', $ud);
    Route::get('/upload', $ud);
});


// AKADEMIK: KALENDER AKADEMIK
Route::get('/kalender-akademik', [KalendarAkademikController::class, 'index']);


// AKADEMIK: JADWAL
Route::get('/jadwal-semua-kelas', function () {
    return Inertia::render('Akademik/JadwalSemuaKelas/Index');
});


Route::get('/lms-materi', $ud);
Route::get('/lms-tugas', $ud);


// PPDB
Route::prefix('ppdb')->group(function () use ($ud) {
    Route::get('/', $ud);
    Route::get('/pendaftaran', $ud);
    Route::get('/pendaftar', $ud);
    Route::get('/verifikasi-berkas', $ud);
    Route::get('/seleksi', $ud);
    Route::get('/pengumuman-kelulusan', $ud);
    Route::get('/penempatan-rombel', $ud);
    Route::get('/pengaturan', $ud);
});


// KEDISIPLINAN SISWA
Route::prefix('kedisiplinan')->name('kedisiplinan.')->group(function () {

    // DASHBOARD
    Route::get('/', [KedisiplinanController::class, 'dashboard'])->name('dashboard');

    // PERLU TINDAKAN
    Route::get('/perlu-tindakan', [KedisiplinanController::class, 'perluTindakan'])->name('perlu-tindakan');

    // SISWA
    Route::get('/siswa', [KedisiplinanController::class, 'siswaIndex'])->name('siswa.index');
    Route::get('/siswa/{siswa}', [KedisiplinanController::class, 'siswaShow'])->name('siswa.show');

    // RIWAYAT
    Route::get('/riwayat-sanksi', [KedisiplinanController::class, 'riwayatSanksi'])->name('riwayat-sanksi');

    // MASTER DATA
    Route::prefix('master')->name('master.')->group(function () {
        Route::get('/jenis-pelanggaran', [KedisiplinanController::class, 'jenisPelanggaranIndex'])->name('jenis-pelanggaran.index');
        Route::get('/jenis-sanksi', [KedisiplinanController::class, 'jenisSanksiIndex'])->name('jenis-sanksi.index');
    });
});





// ADMINISTRASI
Route::prefix('payroll')->group(function () use ($ud) {
    Route::get('/', $ud);
    Route::get('/run', $ud);
    Route::get('/slip', $ud);
});


// PENGGUNA
Route::get('/akun', $ud);
Route::get('/rfid', $ud);


// MASTER DATA
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

    Route::get('/staff', $ud);
    
    Route::get('/jadwal-ajar', [JadwalController::class, 'index'])
        ->name('jadwal.index');
    Route::get('/rombel', $ud);
    Route::get('/rombel', [KelasController::class, 'index'])
    ->name('kelas.index');
});



// KONFIGURASI
Route::prefix('konfigurasi')->group(function () use ($ud) {

    Route::prefix('jadwal')->group(function () use ($ud) {
        Route::get('/', $ud);
        Route::get('/hari', [HariController::class, 'index'])
            ->name('hari.index');
        Route::get('/jam', [JamController::class, 'index'])
            ->name('jam.index');       
        Route::get('/semester', [SemesterController::class, 'index'])
            ->name('semester.index');
            });

        Route::prefix('kalender-akademik')->group(function () use ($ud) {
            Route::get('/', $ud);
        
        Route::get('/giat-khusus', [KegiatanKhususController::class, 'index'])
            ->name('kegiatan-khusus.index');
        
        Route::get('/giat-tahunan', [KegiatanTahunanController::class, 'index'])
            ->name('kegiatan-tahunan.index');
            });

    Route::get('/jurusan', [JurusanController::class, 'index'])
    ->name('jurusan.index');
    Route::get('/mapel', [MapelController::class, 'index'])
    ->name('mapel.index');
    Route::get('/titik-absen', $ud);
    Route::get('/role', [RoleController::class, 'index'])
    ->name('role.index');
});
