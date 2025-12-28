<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        return Inertia::render('Master-Data/Kelas/Index', [
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
        ]);
    }
}
