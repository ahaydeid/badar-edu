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

    // Data Siswa versi menu "Kelas Binaan"
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
    return Inertia::render('Akademik/JadwalMapel/Index');
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


// KEDISIPLINAN
Route::prefix('kedisiplinan')->group(function () use ($ud) {
    Route::get('/', $ud);
    Route::get('/status', $ud);
    Route::get('/pelanggaran', $ud);
    Route::get('/konseling', $ud);
    Route::get('/sp', $ud);
    Route::get('/pemanggilan', $ud);
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
    Route::get('/jadwal-ajar', $ud);
    Route::get('/rombel', $ud);
    Route::get('/alumni', $ud);
});



// KONFIGURASI
Route::prefix('konfigurasi')->group(function () use ($ud) {

    Route::prefix('jadwal')->group(function () use ($ud) {
        Route::get('/', $ud);
        Route::get('/hari', $ud);
        Route::get('/jam', $ud);
        Route::get('/semester', $ud);
    });

    Route::prefix('kalender-akademik')->group(function () use ($ud) {
        Route::get('/', $ud);
        Route::get('/giat-khusus', $ud);
        Route::get('/giat-tahunan', $ud);
    });

    Route::get('/jurusan', $ud);
    Route::get('/mapel', $ud);
    Route::get('/titik-absen', $ud);
    Route::get('/role', $ud);
});
