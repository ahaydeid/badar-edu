<?php

namespace App\Http\Controllers\Konfigurasi;

use App\Http\Controllers\Controller;
use App\Models\AbsenLokasiKantor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TitikAbsenController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/TitikAbsen/Index', [
            'locations' => AbsenLokasiKantor::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|integer|min:1',
            'is_active' => 'required|boolean',
        ]);

        AbsenLokasiKantor::create($validated);

        return back()->with('success', 'Lokasi berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $location = AbsenLokasiKantor::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|integer|min:1',
            'is_active' => 'required|boolean',
        ]);

        $location->update($validated);

        return back()->with('success', 'Lokasi berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $location = AbsenLokasiKantor::findOrFail($id);
        $location->delete();

        return back()->with('success', 'Lokasi berhasil dihapus.');
    }
}
