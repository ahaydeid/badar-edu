<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Get primary dashboard type from roles
        $dashboardType = $user->roles->first()?->dashboard_type ?? 'admin';

        return match ($dashboardType) {
            'guru_mapel' => $this->guruMapelDashboard(),
            'wali_kelas' => $this->waliKelasDashboard(),
            'staff'      => $this->staffDashboard(),
            default      => $this->adminDashboard(),
        };
    }

    protected function adminDashboard()
    {
        return Inertia::render('Dashboard/Index', [
            'totalSiswa' => \App\Models\Siswa::count(),
            'totalGuru' => \App\Models\Guru::count(),
            'totalRombel' => \App\Models\Kelas::count(),
            'totalMapel' => \App\Models\Mapel::count(),
        ]);
    }

    protected function guruMapelDashboard()
    {
        $user = auth()->user();
        $guruId = $user->profile_id;
        $today = \Carbon\Carbon::today();
        
        // 1. Get Active Semester
        $semester = \App\Models\Semester::whereDate('tanggal_mulai', '<=', $today->toDateString())
            ->whereDate('tanggal_selesai', '>=', $today->toDateString())
            ->first();
        
        if (!$semester) {
            return $this->adminDashboard(); // Fallback or informative view
        }

        // 2. Quick Stats
        $classesTaught = \App\Models\Jadwal::where('guru_id', $guruId)
            ->where('semester_id', $semester->id)
            ->distinct('kelas_id')
            ->count('kelas_id');
            
        $totalStudents = \App\Models\Siswa::whereIn('rombel_saat_ini', function($query) use ($guruId, $semester) {
            $query->select('kelas_id')
                ->from('jadwal')
                ->where('guru_id', $guruId)
                ->where('semester_id', $semester->id);
        })->count();

        // 3. Pending Grades
        $pendingGrades = \App\Models\SubPenilaian::whereHas('jenisPenilaian', function($q) use ($guruId, $semester) {
            $q->where('guru_id', $guruId)->where('semester_id', $semester->id);
        })->where('status', 'proses')->count();

        // 4. Tasks (Pending/Unfinished SubPenilaian)
        $tasks = \App\Models\SubPenilaian::with(['jenisPenilaian.kelas', 'jenisPenilaian.mapel'])
            ->whereHas('jenisPenilaian', function($q) use ($guruId, $semester) {
                $q->where('guru_id', $guruId)->where('semester_id', $semester->id);
            })
            ->where('status', 'proses')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->nama,
                'kelas' => $item->jenisPenilaian->kelas->nama,
                'kelas_id' => $item->jenisPenilaian->kelas_id,
                'mapel' => $item->jenisPenilaian->mapel->nama,
                'progress' => $item->nilaiSiswa()->count(), // Simple count of students graded
                'total' => \App\Models\Siswa::where('rombel_saat_ini', $item->jenisPenilaian->kelas_id)->count(),
            ]);

        return Inertia::render('Dashboard/GuruMapelDashboard', [
            'stats' => [
                'totalKelas' => $classesTaught,
                'totalSiswa' => $totalStudents,
                'pendingGrades' => $pendingGrades,
            ],
            'tasks' => $tasks,
            'attendanceTrends' => $this->getAttendanceTrends($guruId, $semester->id),
            'gradeProgress' => $this->getGradeProgress($guruId, $semester->id),
            'active_semester' => [
                'nama' => $semester->nama,
                'tahun_ajaran_dari' => $semester->tahun_ajaran_dari,
                'tahun_ajaran_sampai' => $semester->tahun_ajaran_sampai,
            ],
        ]);
    }

    protected function waliKelasDashboard()
    {
        return $this->adminDashboard(); // Placeholder
    }

    protected function staffDashboard()
    {
        return $this->adminDashboard(); // Placeholder
    }

    private function getAttendanceTrends($guruId, $semesterId)
    {
        $today = \Carbon\Carbon::today();
        
        // Get classes taught by this guru
        $classes = \App\Models\Jadwal::where('guru_id', $guruId)
            ->where('semester_id', $semesterId)
            ->with('kelas')
            ->get()
            ->pluck('kelas.nama', 'kelas_id')
            ->unique();

        if ($classes->isEmpty()) return [];

        $trends = [];
        // Last 4 weeks including current week
        for ($i = 3; $i >= 0; $i--) {
            $startOfWeek = $today->copy()->subWeeks($i)->startOfWeek();
            $endOfWeek = $startOfWeek->copy()->endOfWeek();
            $label = "W" . (4 - $i);
            
            $data = ['week' => $label];
            
            foreach ($classes as $kelasId => $kelasNama) {
                // Modified logic for Monthly Recap structure
                // We need to find all recap headers for this class in this week
                $recapHeaders = \App\Models\AbsenJp::whereBetween('tanggal', [$startOfWeek, $endOfWeek])
                    ->whereHas('jadwal', function($q) use ($kelasId, $guruId) {
                        $q->where('kelas_id', $kelasId)->where('guru_id', $guruId);
                    })
                    ->pluck('id');

                if ($recapHeaders->isNotEmpty()) {
                    // Total attendance sessions recorded (sum of all status types)
                    $totalPossibleAttendances = \App\Models\AbsenJpDetail::whereIn('absen_jp_id', $recapHeaders)
                        ->sum('jumlah');

                    if ($totalPossibleAttendances > 0) {
                        $hadirCount = \App\Models\AbsenJpDetail::whereIn('absen_jp_id', $recapHeaders)
                            ->where('jenis_absen_id', 1) // 1 = Hadir
                            ->sum('jumlah');

                        $percentage = ($hadirCount / $totalPossibleAttendances) * 100;
                        $data[$kelasNama] = round($percentage);
                    } else {
                        $data[$kelasNama] = 0;
                    }
                } else {
                    $data[$kelasNama] = 0;
                }
            }
            $trends[] = $data;
        }

        return $trends;
    }

    private function getGradeProgress($guruId, $semesterId)
    {
        $semester = \App\Models\Semester::find($semesterId);
        if (!$semester) return [];

        $start = \Carbon\Carbon::parse($semester->tanggal_mulai);
        $end = \Carbon\Carbon::parse($semester->tanggal_selesai);
        $now = \Carbon\Carbon::today();
        
        $months = [];
        $current = $start->copy()->startOfMonth();
        $endMonth = ($now->lt($end) ? $now : $end)->copy()->endOfMonth();

        while ($current->lte($endMonth)) {
            $months[] = [
                'label' => $current->format('M'),
                'until' => $current->copy()->endOfMonth()->toDateString()
            ];
            $current->addMonth();
        }

        $progressData = [];
        foreach ($months as $m) {
            $totalSub = \App\Models\SubPenilaian::whereHas('jenisPenilaian', function($q) use ($guruId, $semesterId) {
                $q->where('guru_id', $guruId)->where('semester_id', $semesterId);
            })->whereDate('created_at', '<=', $m['until'])->count();

            $doneSub = \App\Models\SubPenilaian::whereHas('jenisPenilaian', function($q) use ($guruId, $semesterId) {
                $q->where('guru_id', $guruId)->where('semester_id', $semesterId);
            })->where('status', 'selesai')->whereDate('updated_at', '<=', $m['until'])->count();

            $percentage = $totalSub > 0 ? round(($doneSub / $totalSub) * 100) : 0;
            $progressData[] = ['month' => $m['label'], 'progress' => $percentage];
        }

        return $progressData;
    }
}
