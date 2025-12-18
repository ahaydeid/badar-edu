<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use App\Models\Hari;
use Inertia\Inertia;

class JadwalGuruController extends Controller
{
  public function index()
{
    $guruId = 39;

    // Ambil semua jadwal guru
    $rawJadwals = Jadwal::with(['kelas','jam'])
        ->where('guru_id', $guruId)
        ->get();

    // Group jadwal: 1 hari bisa banyak kelas
    $jadwals = $rawJadwals
        ->filter(fn ($j) => $j->hari_id && $j->kelas_id && $j->mapel_id)
        ->groupBy(fn ($j) => $j->hari_id.'-'.$j->kelas_id.'-'.$j->mapel_id)
        ->map(function ($group) {
            $first = $group->first();

            return [
                'id' => (int) $first->id,
                'hari_id' => (int) $first->hari_id,
                'kelas' => ['nama' => $first->kelas?->nama],
                'jp' => $group->sum(fn ($j) => $j->jam?->jumlah_jp ?? 0),
                'jamLabels' => $group->sortBy(fn ($j) => strtotime($j->jam?->jam_mulai))->pluck('jam.nama')->filter()->values()->toArray(),
                'jamMulai' => substr($group->min(fn ($j) => $j->jam?->jam_mulai), 0, 5),
                'jamSelesai' => substr($group->max(fn ($j) => $j->jam?->jam_selesai), 0, 5),
            ];
        })
        ->values()
        ->toArray();

    // Ambil hari SENIN–SABTU yang BENAR-BENAR punya jadwal
    $hariIds = collect($jadwals)->pluck('hari_id')->unique();

    $days = Hari::orderBy('hari_ke')
        ->whereIn('id', $hariIds)
        ->where('nama', '!=', 'Minggu')
        ->get(['id','nama'])
        ->toArray();

    return Inertia::render('Akademik/JadwalMapel/Index', [
        'days' => $days,
        'jadwals' => $jadwals,
    ]);
}

}
