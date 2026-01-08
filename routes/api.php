<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\V1\AuthController;

// API V1
Route::prefix('v1')->group(function () {
    
    // Authentication Routes
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('profile', [AuthController::class, 'profile']);
            Route::post('refresh', [AuthController::class, 'refresh']);
        });
    });

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // Pengumuman
        Route::get('pengumuman', [\App\Http\Controllers\API\V1\PengumumanController::class, 'index']);
        
        Route::prefix('guru-attendance')->group(function () {
            Route::post('/check-in', [\App\Http\Controllers\Api\V1\GuruAttendanceController::class, 'checkIn']);
            Route::post('/check-out', [\App\Http\Controllers\Api\V1\GuruAttendanceController::class, 'checkOut']);
            Route::get('/today', [\App\Http\Controllers\Api\V1\GuruAttendanceController::class, 'today']);
            Route::get('/config', [\App\Http\Controllers\Api\V1\GuruAttendanceController::class, 'getConfig']);
            Route::get('/log', [\App\Http\Controllers\Api\V1\GuruAttendanceLogController::class, 'index']);
        });
        
        // Guru Schedule
        Route::get('guru-schedule', [\App\Http\Controllers\Api\V1\GuruScheduleController::class, 'index']);
        Route::get('guru-schedule/{id}', [\App\Http\Controllers\Api\V1\GuruScheduleController::class, 'show']);
        Route::post('guru-schedule/{id}/finish', [\App\Http\Controllers\Api\V1\GuruScheduleController::class, 'finish']);

        // Kalender Akademik
        Route::get('kaldik', [\App\Http\Controllers\Api\V1\KaldikController::class, 'index']);

        // Student Attendance
        Route::get('student-attendance/{jadwal_id}', [\App\Http\Controllers\Api\V1\StudentAttendanceController::class, 'getStudents']);
        Route::post('student-attendance/{jadwal_id}', [\App\Http\Controllers\Api\V1\StudentAttendanceController::class, 'saveAttendance']);

        // Profile & Account Settings
        Route::post('profile/update', [\App\Http\Controllers\Api\V1\ProfileController::class, 'updateProfile']);
        Route::post('profile/change-password', [\App\Http\Controllers\Api\V1\ProfileController::class, 'updatePassword']);

        // Future API endpoints will be added here
        // Example: Jadwal, Absensi, Penilaian, etc.
    });
});

// Legacy routes (keep for backward compatibility)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// PPDB Public API
Route::prefix('ppdb')->group(function () {
    // Informasi PPDB Aktif (Public)
    Route::get('/active-period', [\App\Http\Controllers\Api\V1\PpdbInfoController::class, 'getActivePeriod']);
    
    // Autentikasi & Verifikasi
    Route::post('/register', [\App\Http\Controllers\Api\V1\PpdbAuthController::class, 'register']);
    Route::post('/verify-otp', [\App\Http\Controllers\Api\V1\PpdbAuthController::class, 'verifyOtp']);
    Route::post('/resend-otp', [\App\Http\Controllers\Api\V1\PpdbAuthController::class, 'resendOtp']);
    Route::post('/login', [\App\Http\Controllers\Api\V1\PpdbAuthController::class, 'login']);
    
    // Legacy/Old Registration (might be replaced by the one above)
    // Route::post('/submit-old', [\App\Http\Controllers\Api\PpdbController::class, 'store']);
    Route::get('/check-status/{no_pendaftaran}', [\App\Http\Controllers\Api\PpdbController::class, 'checkStatus']);
});

// Teacher Attendance API (Legacy)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/attendance/check-in', [\App\Http\Controllers\Api\AttendanceController::class, 'checkIn']);
});
