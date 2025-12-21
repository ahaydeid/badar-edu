<?php

namespace App\Http\Controllers\Konfigurasi\Jadwal;

use App\Http\Controllers\Controller;
use App\Models\Jam;
use Inertia\Inertia;

class JamController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/Jadwal/Jam/Index', [
            'jam' => Jam::orderBy('jam_mulai')->get(),
        ]);
    }
}
