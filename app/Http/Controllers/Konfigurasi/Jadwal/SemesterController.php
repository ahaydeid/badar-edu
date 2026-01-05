<?php

namespace App\Http\Controllers\Konfigurasi\Jadwal;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SemesterController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/Jadwal/Semester/Index', [
            'semester' => Semester::orderBy('tahun_ajaran_dari', 'desc')
                ->orderBy('tipe')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:GANJIL,GENAP',
            'tahun_ajaran_dari' => 'required|integer|min:2000',
            'tahun_ajaran_sampai' => 'required|integer|min:2000',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
        ]);

        Semester::create($request->all());

        return redirect('/konfigurasi/jadwal/semester')
            ->with('success', 'Semester berhasil ditambahkan.');
    }

    public function update(Request $request, Semester $semester)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:GANJIL,GENAP',
            'tahun_ajaran_dari' => 'required|integer|min:2000',
            'tahun_ajaran_sampai' => 'required|integer|min:2000',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
        ]);

        $semester->update($request->all());

        return redirect('/konfigurasi/jadwal/semester')
            ->with('success', 'Semester berhasil diperbarui.');
    }
}
