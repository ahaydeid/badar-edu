<?php

namespace App\Http\Controllers\GuruMapel;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PenilaianController extends Controller
{
    public function index()
    {
        return Inertia::render('Akademik/NilaiMapel/Index');
    }

    public function detail($kelas)
    {
        return Inertia::render('Akademik/NilaiMapel/Detail', [
            'kelasId' => $kelas,
        ]);
    }

    public function subPenilaian($kelas, $penilaian)
    {
        return inertia('Akademik/NilaiMapel/SubPenilaian', [
            'kelasId' => $kelas,
            'penilaianId' => $penilaian,
        ]);
    }

}
