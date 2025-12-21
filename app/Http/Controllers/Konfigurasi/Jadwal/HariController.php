<?php

namespace App\Http\Controllers\Konfigurasi\Jadwal;

use App\Http\Controllers\Controller;
use App\Models\Hari;
use Inertia\Inertia;

class HariController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/Jadwal/Hari/Index', [
            'hari' => Hari::orderBy('hari_ke')->get(),
        ]);
    }
}
