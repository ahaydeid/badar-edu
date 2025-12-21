<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index()
    {
        return Inertia::render('Master-Data/Jadwal/Index', [
            'jadwal' => Jadwal::with([
                'hari:id,nama',
                'jam:id,nama',
                'kelas:id,nama',
                'guru:id,nama',
                'mapel:id,nama',
                'semester:id,nama'
            ])
            ->orderBy('hari_id')
            ->orderBy('jam_id')
            ->get(),
        ]);
    }
}
