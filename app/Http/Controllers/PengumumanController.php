<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengumumanController extends Controller
{
    public function index()
    {
        return Inertia::render('Pengumuman/Index', [
            'pengumuman' => Pengumuman::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Pengumuman/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|max:2048',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'target' => 'required|in:semua,siswa,guru,kelas',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('pengumuman', 'public');
        }

        Pengumuman::create($data);

        return redirect()->route('pengumuman.index');
    }

    public function edit(Pengumuman $pengumuman)
    {
        return Inertia::render('Pengumuman/Edit', [
            'pengumuman' => $pengumuman,
        ]);
    }

    public function update(Request $request, Pengumuman $pengumuman)
    {
        $data = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|max:2048',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'target' => 'required|in:semua,siswa,guru,kelas',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('pengumuman', 'public');
        }

        $pengumuman->update($data);

        return redirect()->route('pengumuman.index');
    }

    public function destroy(Pengumuman $pengumuman)
    {
        $pengumuman->delete();

        return back();
    }
}
