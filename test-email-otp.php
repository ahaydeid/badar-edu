<?php

use App\Models\PpdbUser;
use App\Models\PpdbVerification;
use App\Mail\PpdbOtpMail;
use Illuminate\Support\Facades\Mail;

// Test 1: Kirim email sederhana
echo "=== TEST 1: Kirim Email Sederhana ===\n";
try {
    Mail::raw('Ini adalah test email dari sistem PPDB Badu menggunakan Brevo SMTP.', function($message) {
        $message->to('ahaydehadi@gmail.com')
                ->subject('Test Email PPDB - Brevo');
    });
    echo "✅ Email sederhana berhasil dikirim ke ahaydehadi@gmail.com\n";
    echo "Silakan cek inbox atau folder spam.\n\n";
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n\n";
}

// Test 2: Kirim email OTP menggunakan template
echo "=== TEST 2: Kirim Email OTP dengan Template ===\n";
try {
    // Buat dummy user untuk test
    $dummyUser = new \stdClass();
    $dummyUser->nama_lengkap = "Test User PPDB";
    $dummyUser->email = "ahaydehadi@gmail.com";
    
    $testOtp = "123456";
    
    Mail::to('ahaydehadi@gmail.com')->send(new PpdbOtpMail($dummyUser, $testOtp));
    
    echo "✅ Email OTP berhasil dikirim dengan kode: {$testOtp}\n";
    echo "Silakan cek inbox untuk melihat template email OTP.\n\n";
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n\n";
}

echo "=== SELESAI ===\n";
echo "Jika kedua test berhasil, sistem email OTP sudah siap digunakan!\n";
