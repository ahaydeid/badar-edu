<?php

namespace App\Http\Controllers\Konfigurasi\Jadwal;

use App\Http\Controllers\Controller;
use App\Models\Semester;
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
}
