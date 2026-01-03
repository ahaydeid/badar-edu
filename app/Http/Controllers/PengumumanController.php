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
            'pengumuman' => Pengumuman::with('roles')->latest()->get(),
        ]);
    }

    public function create()
    {
        $roles = \Spatie\Permission\Models\Role::query()
            ->when(!auth()->user()->hasRole('devhero'), function ($q) {
                return $q->where('name', '!=', 'devhero');
            })
            ->get(['id', 'name']);

        return Inertia::render('Pengumuman/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|max:2048',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'is_active' => 'boolean',
            'role_ids' => 'nullable|array',
            'role_ids.*' => 'exists:roles,id',
        ]);

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('pengumuman', 'public');
        } else {
            unset($data['gambar']);
        }

        $pengumuman = Pengumuman::create($data);

        if ($request->has('role_ids')) {
            $pengumuman->roles()->sync($request->role_ids);
        }

        return redirect()->route('pengumuman.index')->with('success', 'Pengumuman berhasil ditambahkan!');
    }

    public function edit(Pengumuman $pengumuman)
    {
        $roles = \Spatie\Permission\Models\Role::query()
            ->when(!auth()->user()->hasRole('devhero'), function ($q) {
                return $q->where('name', '!=', 'devhero');
            })
            ->get(['id', 'name']);

        return Inertia::render('Pengumuman/Edit', [
            'pengumuman' => $pengumuman->load('roles:id,name'),
            'roles' => $roles,
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
            'is_active' => 'boolean',
            'role_ids' => 'nullable|array',
            'role_ids.*' => 'exists:roles,id',
        ]);

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('pengumuman', 'public');
        } else {
            unset($data['gambar']);
        }

        $pengumuman->update($data);

        if ($request->has('role_ids')) {
            $pengumuman->roles()->sync($request->role_ids);
        } else {
            $pengumuman->roles()->detach();
        }

        return redirect()->route('pengumuman.index')->with('success', 'Pengumuman berhasil diperbarui!');
    }

    public function destroy(Pengumuman $pengumuman)
    {
        $pengumuman->delete();

        return back()->with('success', 'Pengumuman berhasil dihapus!');
    }
}
