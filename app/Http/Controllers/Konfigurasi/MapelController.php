<?php

namespace App\Http\Controllers\Konfigurasi;

use App\Http\Controllers\Controller;
use App\Models\Mapel;
use App\Models\Guru;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapelController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/Mapel/Index', [
            'mapel' => Mapel::with(['jurusan:id,nama', 'guru:id,nama'])
                ->orderBy('nama')
                ->get(),
            'gurus' => Guru::select('id', 'nama')->orderBy('nama')->get(),
            'jurusans' => Jurusan::select('id', 'nama')->orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode_mapel' => 'required|string|max:50|unique:mapel,kode_mapel',
            'kategori' => 'required|string',
            'tingkat' => 'required|integer',
            'jurusan_id' => 'nullable|exists:jurusan,id',
            'guru_id' => 'nullable|exists:guru,id',
            'warna_hex_mapel' => 'nullable|string|max:7',
        ]);

        Mapel::create($validated);

        return back()->with('success', 'Mata pelajaran berhasil ditambahkan.');
    }

    public function update(Request $request, Mapel $mapel)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode_mapel' => 'required|string|max:50|unique:mapel,kode_mapel,' . $mapel->id,
            'kategori' => 'required|string',
            'tingkat' => 'required|integer',
            'jurusan_id' => 'nullable|exists:jurusan,id',
            'guru_id' => 'nullable|exists:guru,id',
            'warna_hex_mapel' => 'nullable|string|max:7',
        ]);

        $mapel->update($validated);

        return back()->with('success', 'Mata pelajaran berhasil diperbarui.');
    }

    public function destroy(Mapel $mapel)
    {
        $mapel->delete();
        return back()->with('success', 'Mata pelajaran berhasil dihapus.');
    }
}
