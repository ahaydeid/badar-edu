<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'totalSiswa' => \App\Models\Siswa::count(),
            'totalGuru' => \App\Models\Guru::count(),
            'totalRombel' => \App\Models\Kelas::count(),
            'totalMapel' => \App\Models\Mapel::count(),
        ]);
    }
}
