<?php

namespace App\Http\Controllers\PPDB;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SiswaBaruController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\Pendaftar::with(['jurusan', 'period'])
            ->where('status', 'Siswa Baru');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('no_pendaftaran', 'like', "%{$search}%")
                  ->orWhere('asal_sekolah', 'like', "%{$search}%");
            });
        }

        $siswaBaru = $query->orderBy('nama_lengkap', 'asc')
            ->get();

        return Inertia::render('PPDB/SiswaBaru/Index', [
            'siswaBaru' => $siswaBaru
        ]);
    }

    public function bulkMigrate(Request $request)
    {
        $pendaftars = \App\Models\Pendaftar::where('status', 'Siswa Baru')->get();

        if ($pendaftars->isEmpty()) {
            return redirect()->back()->with('error', 'Tidak ada data siswa baru untuk dimigrasi.');
        }

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            foreach ($pendaftars as $p) {
                // Split RT/RW if exists (format usually RT 001 / RW 002)
                $rt = null;
                $rw = null;
                if ($p->rt_rw && str_contains($p->rt_rw, '/')) {
                    $parts = explode('/', $p->rt_rw);
                    $rt = trim(str_replace('RT', '', $parts[0]));
                    $rw = trim(str_replace('RW', '', $parts[1] ?? ''));
                }

                \App\Models\Siswa::create([
                    'nama' => $p->nama_lengkap,
                    'nisn' => $p->nisn,
                    'nik' => $p->nik,
                    'jenis_kelamin' => $p->jenis_kelamin,
                    'tempat_lahir' => $p->tempat_lahir,
                    'tanggal_lahir' => $p->tanggal_lahir,
                    'agama' => $p->agama,
                    'alamat' => $p->alamat_jalan,
                    'rt' => $rt,
                    'rw' => $rw,
                    'kelurahan' => $p->desa_kelurahan,
                    'kecamatan' => $p->kecamatan,
                    'kode_pos' => $p->kode_pos,
                    'sekolah_asal' => $p->asal_sekolah,
                    'hp' => $p->no_hp_siswa,
                    // Additional fields can be mapped here
                ]);

                // Update status in pendaftars table
                $p->update(['status' => 'Migrasi Selesai']);
            }

            \Illuminate\Support\Facades\DB::commit();
            return redirect()->back()->with('success', count($pendaftars) . ' siswa berhasil dimigrasikan ke data induk.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return redirect()->back()->with('error', 'Gagal migrasi: ' . $e->getMessage());
        }
    }
}
