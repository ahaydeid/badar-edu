<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftar;
use App\Models\PpdbPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PpdbController extends Controller
{
    /**
     * Submit new PPDB registration
     */
    public function store(Request $request)
    {
        // 1. Check if PPDB is active
        $activePeriod = PpdbPeriod::where('status', 'Aktif')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();

        if (!$activePeriod) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran PPDB sedang ditutup.',
            ], 403);
        }

        // 2. Validate Input
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|unique:ppdb_users,email',
            'password' => 'required|min:8',
            'nik' => 'required|digits:16|unique:pendaftars,nik',
            'nisn' => 'nullable|digits:10|unique:pendaftars,nisn',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'asal_sekolah' => 'required|string|max:255',
            'alamat_jalan' => 'required|string',
            'nama_ayah' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'no_hp_siswa' => 'required|string|max:15',
            'jurusan_id' => 'required|exists:jurusan,id', 
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

            // 3. Create PPDB User Account
            $user = \App\Models\PpdbUser::create([
                'email' => $request->email,
                'password' => bcrypt($request->password), // In real app, maybe hashing needed if not handled by model
                'nama_lengkap' => $request->nama_lengkap,
                'no_hp' => $request->no_hp_siswa,
            ]);

            // 4. Generate No Pendaftaran (Format: PPDB-YYYY-XXXX)
            $year = date('Y');
            $lastPendaftar = Pendaftar::whereYear('created_at', $year)->orderBy('id', 'desc')->first();
            $nextNumber = $lastPendaftar ? (intval(substr($lastPendaftar->no_pendaftaran, -4)) + 1) : 1;
            $noPendaftaran = 'PPDB-' . $year . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

            // 5. Create Pendaftar
            $pendaftar = Pendaftar::create([
                'ppdb_period_id' => $activePeriod->id,
                'ppdb_user_id' => $user->id,
                'jurusan_id' => $request->jurusan_id,
                'no_pendaftaran' => $noPendaftaran,
                'nama_lengkap' => $request->nama_lengkap, // Redundant but in schema
                'nik' => $request->nik,
                'nisn' => $request->nisn,
                'tempat_lahir' => $request->tempat_lahir,
                'tanggal_lahir' => $request->tanggal_lahir,
                'jenis_kelamin' => $request->jenis_kelamin,
                'asal_sekolah' => $request->asal_sekolah,
                'alamat_jalan' => $request->alamat_jalan,
                'nama_ayah' => $request->nama_ayah,
                'nama_ibu' => $request->nama_ibu,
                'no_hp_siswa' => $request->no_hp_siswa,
                'status' => 'Menunggu Verifikasi',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran berhasil dikirim.',
                'data' => [
                    'no_pendaftaran' => $noPendaftaran,
                    'nama' => $pendaftar->nama_lengkap,
                    'status' => $pendaftar->status,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan internal server.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check Application Status
     */
    public function checkStatus($no_pendaftaran)
    {
        $pendaftar = Pendaftar::where('no_pendaftaran', $no_pendaftaran)->first();

        if (!$pendaftar) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor pendaftaran tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'no_pendaftaran' => $pendaftar->no_pendaftaran,
                'nama' => $pendaftar->nama_lengkap, // Changed from nama
                'jurusan' => $pendaftar->jurusan ? $pendaftar->jurusan->nama : '-', // Relationship
                'status' => $pendaftar->status,
                'catatan' => $pendaftar->catatan_verifikasi ?? null, // If rejection reason exists
            ]
        ]);
    }
}
