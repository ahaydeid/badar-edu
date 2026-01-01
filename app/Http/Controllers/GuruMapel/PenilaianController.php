<?php

namespace App\Http\Controllers\GuruMapel;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Jadwal;
use App\Models\JenisPenilaian;
use App\Models\Kelas;
use App\Models\NilaiSiswa;
use App\Models\Semester;
use App\Models\Siswa;
use App\Models\SubPenilaian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PenilaianController extends Controller
{
    private function getGuru()
    {
        $user = Auth::user();
        if (!$user || $user->profile_type !== 'App\Models\Guru') {
             abort(403, 'Akses khusus Guru');
        }
        return $user->profile;
    }

    private function getActiveSemester()
    {
        // Based on current date or fallback to first
        // Current Time in prompt is 2026-01-01 (Holiday between semesters)
        // Let's grab the upcoming one or just the latest created to be safe.
        // Or find based on 'now'.
        $now = now();
        
        // REVISI: Prioritaskan semester yang SEDANG BERJALAN atau AKAN DATANG.
        // Jika hari ini 1 Jan (Libur), maka ambil Semester Genap (mulai 6 Jan), 
        // karena Semester Ganjil sudah selesai (20 Des).
        // User ingin melihat data Semester 2.
        return Semester::where('tanggal_selesai', '>=', $now)
            ->orderBy('tanggal_mulai', 'asc')
            ->first() 
            ?? Semester::latest()->firstOrFail();
    }

    public function index()
    {
        try {
            $guru = $this->getGuru();
            $semester = $this->getActiveSemester();

            // Get unique classes from Jadwal for this Guru in current Semester
            $jadwals = Jadwal::with(['kelas', 'mapel'])
                ->where('guru_id', $guru->id)
                ->where('semester_id', $semester->id)
                ->get()
                ->unique(function ($item) {
                    return $item->kelas_id . '-' . $item->mapel_id;
                });
            
            $listKelas = $jadwals->map(function ($j) use ($guru, $semester) {
                // Count students in this class
                $studentCount = Siswa::where('rombel_saat_ini', $j->kelas_id)->count();
                
                // Get simple list of Penilaian names for preview
                $penilaianPreview = JenisPenilaian::where('guru_id', $guru->id)
                    ->where('kelas_id', $j->kelas_id)
                    ->where('mapel_id', $j->mapel_id)
                    ->where('semester_id', $semester->id)
                    ->take(3)
                    ->get(['nama']);

                return [
                    'id' => $j->kelas_id,
                    'mapel_id' => $j->mapel_id,
                    'nama_kelas' => $j->kelas->nama,
                    'nama_mapel' => $j->mapel->nama,
                    'siswa_count' => $studentCount,
                    'penilaian' => $penilaianPreview
                ];
            })->values();

            return Inertia::render('Akademik/NilaiMapel/Index', [
                'listKelas' => $listKelas
            ]);
        } catch (\Exception $e) {
            // Fallback for dev if no guru/semester found
            return Inertia::render('Akademik/NilaiMapel/Index', [
                'listKelas' => []
            ]);
        }
    }

    public function detail($kelasId, Request $request)
    {
        $guru = $this->getGuru();
        $semester = $this->getActiveSemester();
        
        $mapelId = $request->query('mapel');

        if (!$mapelId) {
             $jadwal = Jadwal::where('guru_id', $guru->id)
                ->where('kelas_id', $kelasId)
                ->where('semester_id', $semester->id)
                ->firstOrFail();
             $mapelId = $jadwal->mapel_id;
        }

        $kelas = Kelas::findOrFail($kelasId);
        
        $penilaians = JenisPenilaian::with(['subPenilaian.nilaiSiswa'])
            ->where('guru_id', $guru->id)
            ->where('kelas_id', $kelasId)
            ->where('mapel_id', $mapelId)
            ->where('semester_id', $semester->id)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nama' => $p->nama,
                    'deskripsi' => $p->deskripsi ?? '', 
                    'sub' => $p->subPenilaian->map(function ($s) {
                        return [
                            'id' => $s->id,
                            'nama' => $s->nama,
                            'dinilai' => $s->nilaiSiswa->count(), 
                            // Note: This count is total grades. 
                            // To be accurate "Students Graded", we should count distinct student_id? 
                            // Usually 1 grade per student. So count is fine.
                            // We need Total Students to calc "Belum". 
                            // We will pass total students count to frontend.
                        ];
                    })
                ];
            });

        // Get total students for ratio calculation
        $totalSiswa = Siswa::where('rombel_saat_ini', $kelasId)->count();

        return Inertia::render('Akademik/NilaiMapel/Detail', [
            'kelas' => $kelas->nama,
            'kelasId' => $kelasId, // Pass ID for back link or consistency
            'mapelId' => $mapelId,
            'totalSiswa' => $totalSiswa,
            'penilaians' => $penilaians
        ]);
    }

    public function storeJenis(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required',
            'mapel_id' => 'required',
            'nama' => 'required|string|max:255',
        ]);

        $guru = $this->getGuru();
        $semester = $this->getActiveSemester();

        JenisPenilaian::create([
            'guru_id' => $guru->id,
            'kelas_id' => $request->kelas_id,
            'mapel_id' => $request->mapel_id,
            'semester_id' => $semester->id,
            'nama' => $request->nama,
        ]);

        return back()->with('success', 'Berhasil menambahkan penilaian baru');
    }

    public function subPenilaian($kelasId, $penilaianId)
    {
        $penilaian = JenisPenilaian::with(['kelas', 'mapel'])->findOrFail($penilaianId);
        $guru = $this->getGuru();
        
        if ($penilaian->guru_id !== $guru->id) {
            abort(403);
        }

        $siswaList = Siswa::where('rombel_saat_ini', $kelasId)
            ->orderBy('nama')
            ->get(['id', 'nama']);

        $subPenilaians = SubPenilaian::with(['nilaiSiswa'])
            ->where('jenis_penilaian_id', $penilaianId)
            ->get()
            ->map(function ($sub) use ($siswaList) {
                
                $siswaMapped = $siswaList->map(function ($siswa) use ($sub) {
                    $nilaiRecord = $sub->nilaiSiswa->firstWhere('siswa_id', $siswa->id);
                    return [
                        'id' => $siswa->id,
                        'nama' => $siswa->nama, 
                        'nilai' => $nilaiRecord ? (float) $nilaiRecord->nilai : null // Ensure numeric
                    ];
                });

                return [
                    'id' => $sub->id,
                    'nama' => $sub->nama,
                    'status' => $sub->status,
                    'siswa' => $siswaMapped
                ];
            });

        return Inertia::render('Akademik/NilaiMapel/SubPenilaian', [
            'kelas' => $penilaian->kelas->nama,
            'penilaian' => $penilaian->nama,
            'penilaianId' => $penilaian->id,
            'subPenilaians' => $subPenilaians
        ]);
    }

    public function storeSub(Request $request)
    {
        $request->validate([
            'jenis_penilaian_id' => 'required|exists:jenis_penilaian,id',
            'nama' => 'required|string|max:255',
        ]);

        SubPenilaian::create([
            'jenis_penilaian_id' => $request->jenis_penilaian_id,
            'nama' => $request->nama,
            'status' => 'proses'
        ]);

        return back()->with('success', 'Sub penilaian berhasil ditambahkan.');
    }

    public function updateNilai(Request $request)
    {
        $request->validate([
            'sub_penilaian_id' => 'required|exists:sub_penilaian,id',
            'siswa_data' => 'required|array', 
        ]);

        $subPenilaian = SubPenilaian::findOrFail($request->sub_penilaian_id);

        if ($subPenilaian->status === 'selesai') {
             return back()->with('error', 'Penilaian ini sudah selesai dan tidak dapat diubah.');
        }

        DB::transaction(function () use ($request) {
            foreach ($request->siswa_data as $data) {
                // If nilai is empty string or null, delete? Or set 0? 
                // Let's assume input allows empty to remove grade.
                if (!isset($data['nilai']) || $data['nilai'] === '') {
                     NilaiSiswa::where('sub_penilaian_id', $request->sub_penilaian_id)
                        ->where('siswa_id', $data['siswa_id'])
                        ->delete();
                } else {
                    NilaiSiswa::updateOrCreate(
                        [
                            'sub_penilaian_id' => $request->sub_penilaian_id,
                            'siswa_id' => $data['siswa_id'],
                        ],
                        [
                            'nilai' => $data['nilai']
                        ]
                    );
                }
            }
        });

        return back()->with('success', 'Nilai berhasil disimpan.');
    }

    public function finishSub(Request $request) {
         $request->validate([
            'sub_penilaian_id' => 'required|exists:sub_penilaian,id',
        ]);
        
        SubPenilaian::where('id', $request->sub_penilaian_id)->update(['status' => 'selesai']);
        
        return back()->with('success', 'Penilaian diselesaikan.');
    }

    private function calculateGrades($kelasId, $mapelId, $semesterId, $guruId)
    {
        // 1. Get Jenis & Bobot
        $jenisPenilaians = JenisPenilaian::with(['subPenilaian.nilaiSiswa'])
            ->where('guru_id', $guruId)
            ->where('kelas_id', $kelasId)
            ->where('mapel_id', $mapelId)
            ->where('semester_id', $semesterId)
            ->get();

        // Check if total bobot is 100
        $totalBobot = $jenisPenilaians->sum('bobot');
        if ($totalBobot != 100) {
            throw new \Exception("Total bobot belum 100% (Saat ini: {$totalBobot}%). Harap atur ulang.");
        }

        // 2. Get Students
        $siswaList = Siswa::where('rombel_saat_ini', $kelasId)->get(['id']);

        $results = [];

        foreach ($siswaList as $siswa) {
            $finalScore = 0;

            foreach ($jenisPenilaians as $jenis) {
                // Calc avg for this jenis
                $totalNilai = 0;
                $count = 0;
                foreach ($jenis->subPenilaian as $sub) {
                    $nilaiRecord = $sub->nilaiSiswa->firstWhere('siswa_id', $siswa->id);
                    if ($nilaiRecord) {
                        $totalNilai += $nilaiRecord->nilai;
                        $count++;
                    }
                }
                $avg = ($count > 0) ? ($totalNilai / $count) : 0;
                
                // Add to final score based on weight
                $finalScore += ($avg * ($jenis->bobot / 100));
            }

            $results[] = [
                'siswa_id' => $siswa->id,
                'nilai_akhir' => ceil($finalScore)
                // Predikat can be determined here if rules exist
            ];
        }

        return $results;
    }

    public function hitungAkhir($kelasId, Request $request)
    {
        $guru = $this->getGuru();
        $semester = $this->getActiveSemester();
        
        $mapelId = $request->query('mapel');
        if (!$mapelId) {
             $jadwal = Jadwal::where('guru_id', $guru->id)
                ->where('kelas_id', $kelasId)
                ->where('semester_id', $semester->id)
                ->firstOrFail();
             $mapelId = $jadwal->mapel_id;
        }

        $kelas = Kelas::findOrFail($kelasId);
        $mapel = \App\Models\Mapel::findOrFail($mapelId);

        // Fetch data for view
        $jenisPenilaians = JenisPenilaian::where('guru_id', $guru->id)
            ->where('kelas_id', $kelasId)
            ->where('mapel_id', $mapelId)
            ->where('semester_id', $semester->id)
            ->get(['id', 'nama', 'bobot']);

        $siswaList = Siswa::where('rombel_saat_ini', $kelasId)
            ->orderBy('nama')
            ->get(['id', 'nama', 'nisn']);

        // Reuse calculation logic logic OR keep the raw data fetching for frontend transparency?
        // The frontend wants "nilai_per_jenis" to show the breakdown.
        // My private method `calculateGrades` is optimized for final result only.
        // So I will duplicate the "fetching" part slightly or just keep current hitungAkhir logic as is 
        // and only use `calculateGrades` for strict saving.
        
        // Let's keep existing hitungAkhir logic for VIEW (it fetches Breakdown).
         $allPenilaians = JenisPenilaian::with(['subPenilaian.nilaiSiswa'])
            ->where('guru_id', $guru->id)
            ->where('kelas_id', $kelasId)
            ->where('mapel_id', $mapelId)
            ->where('semester_id', $semester->id)
            ->get();

        $siswaData = $siswaList->map(function ($s) use ($allPenilaians) {
            $nilaiPerJenis = [];
            foreach ($allPenilaians as $jenis) {
                $totalNilai = 0;
                $count = 0;
                foreach ($jenis->subPenilaian as $sub) {
                    $nilaiRecord = $sub->nilaiSiswa->firstWhere('siswa_id', $s->id);
                    if ($nilaiRecord) {
                        $totalNilai += $nilaiRecord->nilai;
                        $count++;
                    }
                }
                $avg = ($count > 0) ? round($totalNilai / $count, 2) : null;
                $nilaiPerJenis[$jenis->id] = $avg;
            }
            return [
                'id' => $s->id,
                'nama' => $s->nama,
                'nisn' => $s->nisn,
                'nilai_per_jenis' => $nilaiPerJenis
            ];
        });

        // Fetch existing saved final grades
        $existingNilaiAkhir = \App\Models\NilaiAkhir::where('guru_id', $guru->id)
            ->where('kelas_id', $kelasId)
            ->where('mapel_id', $mapelId)
            ->where('semester_id', $semester->id)
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->siswa_id => [
                    'nilai' => (int) $item->nilai_akhir,
                    'updated_at' => $item->updated_at,
                    'status' => $item->status,
                ]];
            });

        // Helper to format teacher name
        $formatNamaGuru = function($g) {
            if (!$g) return '-';
            return ($g->gelar_depan ? $g->gelar_depan . ' ' : '') . $g->nama . ($g->gelar_belakang ? ', ' . $g->gelar_belakang : '');
        };

        $waliContext = $kelas->wali; // relation
        $waliName = $formatNamaGuru($waliContext);

        return Inertia::render('Akademik/NilaiMapel/HitungPenilaianAkhir', [
            'kelas' => $kelas,
            'mapel' => $mapel,
            'jenisPenilaians' => $jenisPenilaians,
            'siswaList' => $siswaData,
            'existingGrades' => $existingNilaiAkhir, // Pass to frontend
            'kelasId' => (int)$kelasId,
            'mapelId' => (int)$mapelId,
            'waliKelas' => $waliName,
            'semester' => $semester->nama
        ]);
    }


    public function simpanBobot(Request $request)
    {
        $request->validate([
            'bobot_data' => 'required|array',
            'bobot_data.*.id' => 'required|exists:jenis_penilaian,id',
            'bobot_data.*.bobot' => 'required|numeric|min:0|max:100',
        ]);

        // Validation: Sum must be 100? 
        // Let's enforce it strictly or warn? The UI enforces it. Backend should too.
        $total = collect($request->bobot_data)->sum('bobot');
        if ($total !== 100) {
            return back()->with('error', 'Total bobot harus 100%. Saat ini: ' . $total . '%');
        }

        DB::transaction(function () use ($request) {
            foreach ($request->bobot_data as $item) {
                JenisPenilaian::where('id', $item['id'])->update(['bobot' => $item['bobot']]);
            }
        });

        return back()->with('success', 'Konfigurasi bobot berhasil disimpan.');
    }

    public function kirimNilaiAkhir(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required',
            'mapel_id' => 'required'
        ]);

        $guru = $this->getGuru();
        $semester = $this->getActiveSemester();

        try {
            // Re-calculate securely
            $grades = $this->calculateGrades($request->kelas_id, $request->mapel_id, $semester->id, $guru->id);

            DB::transaction(function () use ($grades, $request, $semester, $guru) {
                foreach ($grades as $grade) {
                    \App\Models\NilaiAkhir::updateOrCreate(
                        [
                            'siswa_id' => $grade['siswa_id'],
                            'mapel_id' => $request->mapel_id,
                            'kelas_id' => $request->kelas_id,
                            'semester_id' => $semester->id,
                        ],
                        [
                            'guru_id' => $guru->id,
                            'nilai_akhir' => $grade['nilai_akhir'],
                            'status' => 'dikirim'
                        ]
                    );
                }
            });

            return back()->with('success', 'Nilai akhir berhasil disimpan dan dikirim ke Wali Kelas.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
