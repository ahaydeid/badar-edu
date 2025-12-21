<?php

namespace App\Http\Controllers\Konfigurasi\KalenderAkademik;

use App\Http\Controllers\Controller;
use App\Models\KegiatanTahunan;
use Inertia\Inertia;

class KegiatanTahunanController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/KalenderAkademik/KegiatanTahunan/Index', [
            'kegiatan' => KegiatanTahunan::orderBy('bulan')
                ->orderBy('tanggal')
                ->get(),
        ]);
    }
}
