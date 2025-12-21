<?php

namespace App\Http\Controllers\Konfigurasi\KalenderAkademik;

use App\Http\Controllers\Controller;
use App\Models\KegiatanKhusus;
use Inertia\Inertia;

class KegiatanKhususController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/KalenderAkademik/KegiatanKhusus/Index', [
            'kegiatan' => KegiatanKhusus::orderBy('tanggal_mulai')->get(),
        ]);
    }
}
