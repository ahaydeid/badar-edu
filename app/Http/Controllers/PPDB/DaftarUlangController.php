<?php

namespace App\Http\Controllers\PPDB;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DaftarUlangController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Pendaftar::with(['jurusan', 'period'])
            ->where('status', 'Diterima');

        // Optional: Add Search
        /*
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('no_pendaftaran', 'like', "%{$search}%");
            });
        }
        */

        $pendaftars = $query->orderBy('nama_lengkap', 'asc')
            ->get()
            ->map(function($p) {
                return [
                    'id' => $p->id,
                    'no_pendaftaran' => $p->no_pendaftaran,
                    'nama' => $p->nama_lengkap,
                    'jurusan' => $p->jurusan->kode ?? '-',
                    'asal_sekolah' => $p->asal_sekolah,
                    'status' => 'Belum', // Default status daftar ulang (need logic/column for this if separate from main status)
                    // For now, let's assume if they are here, they are "Proses" or "Belum". 
                    // Main status is "Diterima". Maybe we need a separate "status_daftar_ulang"?
                    // Or just use main status? But main status is "Diterima".
                    // Let's hardcode 'Belum' for now or maybe check if documents uploaded?
                ];
            });

        return Inertia::render('PPDB/DaftarUlang/Index', [
            'pendaftars' => $pendaftars
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
        ];
        
        $committeeName = $pendaftarData->period->committee_name ?? 'Panitia PPDB';

        $schoolProfile = \App\Models\SchoolSetting::all()->pluck('setting_value', 'setting_key');

        return Inertia::render('PPDB/Cetak/BuktiDaftarUlang', [
            'pendaftar' => $pendaftar,
            'schoolProfile' => $schoolProfile,
            'committeeName' => $committeeName,
        ]);
    }

    public function complete($id)
    {
        $pendaftar = \App\Models\Pendaftar::findOrFail($id);
        $pendaftar->update([
            'status' => 'Siswa Baru'
        ]);

        return redirect()->back()->with('success', 'Status siswa berhasil diperbarui menjadi Siswa Baru.');
    }
}
