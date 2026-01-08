<?php

namespace App\Http\Controllers\HariIni;

use App\Http\Controllers\Controller;
use App\Models\AbsenGuru;
use App\Models\Guru;
use App\Models\Jadwal;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GuruAttendanceReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', Carbon::now()->toDateString());
        $search = $request->query('search');
        $jabatan = $request->query('jabatan', 'Guru'); // Default 'Guru'
        $sortBy = $request->query('sort_by', 'nama'); // nama, hadir, terlambat, sakit, izin, alfa
        $sortOrder = $request->query('sort_order', 'asc');

        $query = Guru::query()
            ->select('guru.id', 'guru.nama', 'guru.jenis_ptk')
            ->whereHas('mapels')
            ->with(['mapels']);

        // Hapus filter jabatan agar tidak membatasi guru yang sebenarnya mengajar mapel
        // tapi jenis_ptk nya bukan 'Guru'.
        
        if ($search) {
            $query->where('nama', 'like', "%{$search}%");
        }

        $gurus = $query->get()->map(function ($guru) use ($startDate, $endDate) {
            $absensi = AbsenGuru::where('guru_id', $guru->id)
                ->whereBetween('tanggal', [$startDate, $endDate])
                ->get();

            $stats = [
                'total' => $absensi->count(),
                'hadir' => $absensi->where('status_id', 1)->count(),
                'izin' => $absensi->where('status_id', 2)->count(),
                'sakit' => $absensi->where('status_id', 3)->count(),
                'alfa' => $absensi->whereIn('status_id', [4, 6])->count(), // Alpha and Tanpa Keterangan
                'terlambat' => $absensi->where('status_id', 5)->count(),
            ];

            // Get unique mapels from mapels relationship (direct guru_id on Mapel table)
            $mapels = $guru->mapels->pluck('nama')->unique()->implode(', ') ?: '-';

            return [
                'id' => $guru->id,
                'nama' => $guru->nama,
                'mapel' => $mapels,
                'stats' => $stats,
            ];
        });

        // Manual sorting since we calculated stats in memory (can be optimized with SQL if dataset is large)
        if (in_array($sortBy, ['hadir', 'terlambat', 'sakit', 'izin', 'alfa', 'total'])) {
            $gurus = $gurus->sortBy(function($item) use ($sortBy) {
                return $item['stats'][$sortBy] ?? 0;
            }, SORT_REGULAR, $sortOrder === 'desc');
        } else {
            $gurus = $gurus->sortBy('nama', SORT_REGULAR, $sortOrder === 'desc');
        }

        // Global stats for header cards
        $totalDays = $gurus->sum('stats.total');
        $globalStats = [
            'hadir' => $totalDays > 0 ? round(($gurus->sum('stats.hadir') / $totalDays) * 100, 1) : 0,
            'terlambat' => $totalDays > 0 ? round(($gurus->sum('stats.terlambat') / $totalDays) * 100, 1) : 0,
            'sakit' => $totalDays > 0 ? round(($gurus->sum('stats.sakit') / $totalDays) * 100, 1) : 0,
            'izin' => $totalDays > 0 ? round(($gurus->sum('stats.izin') / $totalDays) * 100, 1) : 0,
            'alfa' => $totalDays > 0 ? round(($gurus->sum('stats.alfa') / $totalDays) * 100, 1) : 0,
            'period' => Carbon::parse($startDate)->format('d M') . ' - ' . Carbon::parse($endDate)->format('d M Y'),
        ];

        return Inertia::render('HariIni/KehadiranGuru/Index', [
            'gurus' => $gurus->values(),
            'globalStats' => $globalStats,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'search' => $search,
                'jabatan' => $jabatan,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ]
        ]);
    }
}
