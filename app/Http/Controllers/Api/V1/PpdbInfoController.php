<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PpdbPeriod;
use Illuminate\Http\Request;

class PpdbInfoController extends Controller
{
    /**
     * Mendapatkan informasi PPDB yang sedang aktif
     * Untuk ditampilkan di halaman publik Web Profil
     */
    public function getActivePeriod()
    {
        // Ambil periode PPDB yang aktif dan masih dalam rentang waktu
        $activePeriod = PpdbPeriod::with(['jurusans'])
            ->where('status', 'Aktif')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();

        if (!$activePeriod) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada periode PPDB yang sedang berjalan saat ini.',
                'data' => null
            ], 404);
        }

        // Format data untuk Frontend
        $data = [
            'gelombang' => $activePeriod->gelombang,
            'tahun_ajaran' => $activePeriod->tahun_ajaran,
            'periode' => [
                'mulai' => $activePeriod->start_date->format('d M Y'),
                'selesai' => $activePeriod->end_date->format('d M Y'),
                'mulai_raw' => $activePeriod->start_date->format('Y-m-d'),
                'selesai_raw' => $activePeriod->end_date->format('Y-m-d'),
            ],
            'deskripsi' => $activePeriod->deskripsi ?? "Pendaftaran siswa baru untuk tahun ajaran {$activePeriod->tahun_ajaran} telah dimulai. Segera daftarkan diri Anda sebelum kuota setiap kejuruan terpenuhi.",
            'panitia' => $activePeriod->committee_name ?? 'Panitia PPDB',
            'status' => 'Aktif',
            'kuota_jurusan' => $activePeriod->jurusans->map(function ($jurusan) {
                return [
                    'id' => $jurusan->id,
                    'kode' => $jurusan->kode,
                    'nama' => $jurusan->nama,
                    'kuota' => $jurusan->pivot->kuota,
                    'terisi' => $jurusan->pivot->terisi,
                    'sisa' => $jurusan->pivot->kuota - $jurusan->pivot->terisi,
                ];
            })->values()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Data PPDB aktif berhasil diambil.',
            'data' => $data
        ]);
    }
}
