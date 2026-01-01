<?php

namespace App\Http\Controllers\PPDB;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PendaftaranController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Pendaftar::with(['jurusan', 'period', 'dokumens'])
            ->whereIn('status', ['Menunggu Verifikasi', 'Perlu Perbaikan']);

        // Server-side search removed to support client-side filtering on all data
        // if ($request->filled('search')) { ... }
        // if ($request->filled('status')) { ... }

        $pendaftars = $query->orderBy('created_at', 'desc')
            ->get()
            ->map(function($p) {
            return [
                'id' => $p->id,
                'no_pendaftaran' => $p->no_pendaftaran,
                'nama' => $p->nama_lengkap,
                'nik' => $p->nik,
                'nisn' => $p->nisn,
                'asalSekolah' => $p->asal_sekolah,
                'jurusan' => $p->jurusan->kode ?? '-',
                'gelombang' => $p->period->gelombang ?? '-',
                'tanggalDaftar' => $p->created_at->format('Y-m-d'),
                'status' => $p->status,
                // Extra fields for Detail Modal
                'jenis_kelamin' => $p->jenis_kelamin,
                'tempat_lahir' => $p->tempat_lahir,
                'tanggal_lahir' => $p->tanggal_lahir,
                'agama' => $p->agama,
                'no_hp_siswa' => $p->no_hp_siswa,
                'nama_ayah' => $p->nama_ayah,
                'pekerjaan_ayah' => $p->pekerjaan_ayah,
                'nama_ibu' => $p->nama_ibu,
                'alamat_jalan' => $p->alamat_jalan,
            ];
        });

        return Inertia::render('PPDB/Pendaftaran/Index', [
            'pendaftars' => $pendaftars,
            'filters' => $request->only(['search', 'status'])
        ]);
    }
    public function cetak($id)
    {
        // Fetch Real Pendaftar
        $pendaftarData = \App\Models\Pendaftar::with(['jurusan', 'period'])->findOrFail($id);
        
        // Format for View
        $pendaftar = [
            'no_pendaftaran' => $pendaftarData->no_pendaftaran,
            'nama' => $pendaftarData->nama_lengkap,
            'jurusan' => $pendaftarData->jurusan ? $pendaftarData->jurusan->nama : '-',
            'asal_sekolah' => $pendaftarData->asal_sekolah,
            'alamat' => $pendaftarData->alamat_siswa,
            'tanggal_daftar' => $pendaftarData->created_at->format('Y-m-d'),
            'gelombang' => $pendaftarData->period->gelombang ?? '-',
        ];
        
        $committeeName = $pendaftarData->period->committee_name ?? 'Panitia PPDB';

        $schoolProfile = \App\Models\SchoolSetting::all()->pluck('setting_value', 'setting_key');

        return Inertia::render('PPDB/Cetak/BuktiPendaftaran', [
            'pendaftar' => $pendaftar,
            'schoolProfile' => $schoolProfile,
            'committeeName' => $committeeName,
        ]);
    }
}
