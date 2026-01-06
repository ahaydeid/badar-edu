<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PpdbUser;
use App\Models\PpdbVerification;
use App\Mail\PpdbOtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class PpdbAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|unique:ppdb_users,email',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $user = PpdbUser::create([
                'nama_lengkap' => $request->nama_lengkap,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'is_verified' => false,
            ]);

            $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            
            PpdbVerification::create([
                'ppdb_user_id' => $user->id,
                'otp_code' => $otp,
                'expires_at' => now()->addMinutes(10),
                'type' => 'registration',
            ]);

            // Kirim Email
            Mail::to($user->email)->send(new PpdbOtpMail($user, $otp));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registrasi berhasil. Silakan cek email untuk kode verifikasi.',
                'data' => [
                    'email' => $user->email,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan registrasi.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required|digits:6',
        ]);

        $user = PpdbUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }

        if ($user->is_verified) {
            return response()->json(['success' => true, 'message' => 'Email sudah terverifikasi.'], 200);
        }

        $verification = PpdbVerification::where('ppdb_user_id', $user->id)
            ->where('type', 'registration')
            ->latest()
            ->first();

        if (!$verification || $verification->otp_code !== $request->otp_code) {
            return response()->json(['success' => false, 'message' => 'Kode OTP tidak valid.'], 422);
        }

        if ($verification->expires_at->isPast()) {
            return response()->json(['success' => false, 'message' => 'Kode OTP sudah kadaluarsa.'], 422);
        }

        // Update User & Hapus OTP
        $user->update([
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        $verification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Email berhasil diverifikasi.',
        ]);
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = PpdbUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }

        if ($user->is_verified) {
            return response()->json(['success' => true, 'message' => 'Email sudah terverifikasi.'], 200);
        }

        // Cek apakah baru saja kirim OTP (Rate Limit 60 detik)
        $lastVerification = PpdbVerification::where('ppdb_user_id', $user->id)
            ->where('type', 'registration')
            ->latest()
            ->first();

        if ($lastVerification && $lastVerification->created_at->addMinutes(1)->isFuture()) {
            $secondsLeft = now()->diffInSeconds($lastVerification->created_at->addMinutes(1));
            return response()->json([
                'success' => false,
                'message' => "Tunggu {$secondsLeft} detik lagi untuk mengirim ulang kode.",
                'seconds_left' => $secondsLeft
            ], 429);
        }

        try {
            DB::beginTransaction();

            $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            
            PpdbVerification::create([
                'ppdb_user_id' => $user->id,
                'otp_code' => $otp,
                'expires_at' => now()->addMinutes(10),
                'type' => 'registration',
            ]);

            Mail::to($user->email)->send(new PpdbOtpMail($user, $otp));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Kode unik baru telah dikirim ke email Anda.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim ulang kode.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = PpdbUser::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Kredensial tidak valid.'], 401);
        }

        if (!$user->is_verified) {
            return response()->json([
                'success' => false,
                'message' => 'Email belum diverifikasi. Silakan cek email Anda.',
                'verified' => false
            ], 403);
        }

        $token = $user->createToken('ppdb_auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'nama' => $user->nama_lengkap,
                'email' => $user->email,
            ]
        ]);
    }
}
