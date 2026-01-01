<?php

namespace App\Http\Controllers\PPDB;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class VerifikasiController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Pendaftar::with(['jurusan', 'period'])
            ->whereIn('status', ['Terverifikasi', 'Cadangan']);

        $pendaftars = $query->orderBy('created_at', 'asc')
            ->orderBy('nama_lengkap', 'asc')
            ->get()
            ->map(function($p) {
                return [
                    'id' => $p->id,
                    'no_pendaftaran' => $p->no_pendaftaran,
                    'nama' => $p->nama_lengkap,
                    'jurusan' => $p->jurusan->kode ?? '-',
                    'nilai_rapor' => 0, // Placeholder
                    'nilai_wawancara' => 0,
                    'nilai_akhir' => 0,
                    'status' => $p->status,
                    // Additional data for Modal Detail
                    'jenis_kelamin' => $p->jenis_kelamin,
                    'tempat_lahir' => $p->tempat_lahir,
                    'tanggal_lahir' => $p->tanggal_lahir,
                    'agama' => $p->agama,
                    'no_hp_siswa' => $p->no_hp_siswa,
                    'nama_ayah' => $p->nama_ayah,
                    'pekerjaan_ayah' => $p->pekerjaan_ayah,
                    'nama_ibu' => $p->nama_ibu,
                    'alamat_jalan' => $p->alamat_jalan,
                    'asalSekolah' => $p->asal_sekolah,
                    'nik' => $p->nik,
                ];
            });

        return Inertia::render('PPDB/Verifikasi/Index', [
            'pendaftars' => $pendaftars,
            'filters' => $request->only(['search'])
        ]);
    }

    public function update(\Illuminate\Http\Request $request, $id)
    {
        $pendaftar = \App\Models\Pendaftar::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:Diterima,Cadangan,Ditolak,Terverifikasi,Perlu Perbaikan', // Added others just in case
            'catatan' => 'nullable|string'
        ]);

        $pendaftar->update([
            'status' => $request->status,
            'catatan' => $request->catatan // Update note if provided
        ]);

        return back()->with('success', 'Status pendaftar berhasil diperbarui.');
    }
}
