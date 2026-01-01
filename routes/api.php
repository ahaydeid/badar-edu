<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// PPDB Public API
Route::prefix('ppdb')->group(function () {
    Route::post('/register', [\App\Http\Controllers\Api\PpdbController::class, 'store']);
    Route::get('/check-status/{no_pendaftaran}', [\App\Http\Controllers\Api\PpdbController::class, 'checkStatus']);
});
