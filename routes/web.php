<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\AbsensiGuruController;

Route::get('/', fn() => Inertia::render('Home'));
$ud = fn() => Inertia::render('UnderDevelopment');


// DASHBOARD
Route::get('/dashboard', $ud);
Route::get('/hari-ini', $ud);


// HARI INI
Route::get('/absensi-guru', [AbsensiGuruController::class, 'index']);
Route::get('/kelas-berlangsung', fn() => Inertia::render('Hari-Ini/Kelas-Berlangsung/Index'));


// PENGUMUMAN
Route::get('/pengumuman', $ud);


// AKADEMIK: MODUL AJAR
Route::prefix('modul-ajar')->group(function () use ($ud) {
    Route::get('/', $ud);
    Route::get('/upload', $ud);
});


// AKADEMIK: ABSEN SISWA
Route::prefix('absensi-siswa')->group(function () use ($ud) {
    Route::get('/', $ud);
    Route::get('/kelas-diampu', $ud);
    Route::get('/detail', $ud);
});


// AKADEMIK: KELAS BINAAN
Route::prefix('kelas-binaan')->group(function () use ($ud) {
    Route::get('/', $ud);
    Route::get('/absensi', $ud);

    // Data Siswa versi menu "Kelas Binaan"
    Route::get('/siswa', [SiswaController::class, 'index']);
    Route::get('/siswa/{id}', [SiswaController::class, 'show']);
});


// AKADEMIK: TUGAS
Route::get('/tugas', $ud);


// AKADEMIK: KALENDER AKADEMIK
Route::get('/kalender-akademik', $ud);


// AKADEMIK: JADWAL
Route::prefix('jadwal')->group(function () use ($ud) {
    Route::get('/', $ud);
});


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

    // ===== ROUTE YANG SUDAH DIPAKAI MODUL LAIN =====
    Route::get('/siswa', [SiswaController::class, 'index'])->name('siswa.index');
    Route::get('/siswa/{id}', [SiswaController::class, 'show'])->name('siswa.show');
    Route::post('/siswa', [SiswaController::class, 'store'])->name('siswa.store');

    // ===== ROUTE KHUSUS MASTER DATA (EDIT / UPDATE / DELETE) =====
    Route::get('/siswa/{id}/edit', [SiswaController::class, 'edit'])->name('siswa.edit');
    Route::put('/siswa/{id}', [SiswaController::class, 'update'])->name('siswa.update');
    Route::delete('/siswa/{id}', [SiswaController::class, 'destroy'])->name('siswa.destroy');

    // ===== LAINNYA =====
    Route::get('/staff', $ud);
    Route::get('/jadwal-pembelajaran', $ud);
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

    Route::get('/kalender-akademik', $ud);
    Route::get('/giat-tahunan', $ud);
    Route::get('/jurusan', $ud);
    Route::get('/mapel', $ud);
    Route::get('/titik-absen', $ud);
    Route::get('/role', $ud);
});
