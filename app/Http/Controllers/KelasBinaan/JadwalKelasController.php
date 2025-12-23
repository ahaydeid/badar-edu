<?php

namespace App\Http\Controllers\KelasBinaan;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Semester;
use Carbon\Carbon;
use Inertia\Inertia;

class JadwalKelasController extends Controller
{
    public function index()
    {
        $guruId = 17;

        $kelas = Kelas::with('wali')
            ->where('wali_guru_id', $guruId)
            ->firstOrFail();

        $today = Carbon::today();

        $semesterId = Semester::whereDate('tanggal_mulai', '<=', $today)
            ->whereDate('tanggal_selesai', '>=', $today)
            ->value('id');

        if (!$semesterId) {
            return Inertia::render(
                'Akademik/KelasBinaan/JadwalKelas/Index',
                [
                    'jadwal' => [],
                    'kelas'  => $kelas->nama,
                    'wali'   => $kelas->wali?->nama ?? '-',
                ]
            );
        }

        $jadwal = Jadwal::with(['hari', 'jam', 'mapel', 'guru'])
            ->where('kelas_id', $kelas->id)
            ->where('semester_id', $semesterId)
            ->orderBy('hari_id')
            ->orderBy('jam_id')
            ->get()
            ->map(function ($j) {
                return [
                    'hari'        => $j->hari->nama,
                    'hari_ke'     => $j->hari->hari_ke,
                    'jam_mulai'   => substr($j->jam->jam_mulai, 0, 5),
                    'jam_selesai' => substr($j->jam->jam_selesai, 0, 5),
                    'mapel'       => $j->mapel->nama,
                    'guru'        => $j->guru?->nama,
                    'warna'       => $j->mapel->warna_hex_mapel ?? '#334155',
                ];
            })
            ->groupBy('hari');

        return Inertia::render(
            'Akademik/KelasBinaan/JadwalKelas/Index',
            [
                'jadwal' => $jadwal,
                'kelas'  => $kelas->nama,
                'wali'   => $kelas->wali?->nama ?? '-',
            ]
        );
    }
}
