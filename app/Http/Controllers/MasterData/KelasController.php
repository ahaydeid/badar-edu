<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Jurusan;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        $jurusans = Jurusan::select('id', 'nama')->orderBy('nama')->get();
        $gurus = Guru::select('id', 'nama')->orderBy('nama')->get();

        return Inertia::render('MasterData/Kelas/Index', [
            'kelas' => Kelas::with([
                'jurusan:id,nama',
                'wali:id,nama',
            ])
            ->withCount([
                'siswa as jumlah_siswa'
            ])
            ->orderBy('tingkat')
            ->orderBy('nama')
            ->get(),
            'jurusans' => $jurusans,
            'gurus' => $gurus,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'tingkat' => ['required', 'integer', 'in:10,11,12'],
            'jurusan_id' => ['required', 'exists:jurusan,id'],
            'wali_guru_id' => ['nullable', 'exists:guru,id'],
        ]);

        Kelas::create([
            'nama' => $request->nama,
            'tingkat' => $request->tingkat,
            'jurusan_id' => $request->jurusan_id,
            'wali_guru_id' => $request->wali_guru_id,
        ]);

        return back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);

        $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'tingkat' => ['required', 'integer', 'in:10,11,12'],
            'jurusan_id' => ['required', 'exists:jurusan,id'],
            'wali_guru_id' => ['nullable', 'exists:guru,id'],
        ]);

        $kelas->update([
            'nama' => $request->nama,
            'tingkat' => $request->tingkat,
            'jurusan_id' => $request->jurusan_id,
            'wali_guru_id' => $request->wali_guru_id,
        ]);

        return back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);

        // Check if kelas has students
        if ($kelas->siswa()->count() > 0) {
            return back()->with('error', 'Tidak dapat menghapus kelas yang masih memiliki siswa.');
        }

        $kelas->delete();

        return back()->with('success', 'Kelas berhasil dihapus.');
    }
}
