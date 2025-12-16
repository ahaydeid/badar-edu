<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use App\Models\Hari;
use Inertia\Inertia;

class JadwalGuruController extends Controller
{
    public function index()
    {
        $guruId = 3;

        $days = Hari::orderBy('hari_ke')
            ->get(['id', 'nama']);

        $jadwals = Jadwal::with(['kelas', 'jam'])
            ->where('guru_id', $guruId)
            ->get()
            ->map(function ($j) {
                return [
                    'id' => $j->id,
                    'hari_id' => $j->hari_id,
                    'kelas' => [
                        'nama' => $j->kelas?->nama,
                    ],
                    'jamPertama' => $j->jam?->nama,
                    'jamKedua' => $j->jam && $j->jam->jumlah_jp >= 2
                        ? $j->jam->nama
                        : null,
                    'jamMulai' => $j->jam?->jam_mulai,
                    'jamSelesai' => $j->jam?->jam_selesai,
                ];
            });

        return Inertia::render('Akademik/JadwalMapel/Index', [
            'days' => $days,
            'jadwals' => $jadwals,
        ]);
    }
}
