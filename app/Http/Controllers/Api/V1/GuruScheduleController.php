<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AbsenKelas;
use App\Models\Guru;
use App\Models\Jadwal;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GuruScheduleController extends Controller
{
    /**
     * Get Teacher's Teaching Schedule (Merged Block)
     */
    public function index()
    {
        // Get authenticated guru
        $user = Auth::user();
        
        // Check if user has guru profile
        if ($user->profile_type !== 'App\\Models\\Guru' || !$user->profile_id) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak memiliki profil guru',
            ], 403);
        }
        
        $guru = Guru::find($user->profile_id);

        if (!$guru) {
            return response()->json([
                'success' => false,
                'message' => 'Data guru tidak ditemukan',
            ], 404);
        }

        $today = Carbon::today()->toDateString();
        
        // Get jadwal mengajar hari ini
        $hariIni = Carbon::now()->dayOfWeek;
        $hariId = $hariIni == 0 ? 7 : $hariIni;

        $jadwalHariIni = Jadwal::with(['jam', 'kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->where('hari_id', $hariId)
            ->where('is_active', true)
            ->orderBy('jam_id')
            ->get();

        // Get status penyelesaian kelas (AbsenKelas)
        $jadwalIds = $jadwalHariIni->pluck('id');
        $absenKelasRecords = AbsenKelas::whereIn('jadwal_id', $jadwalIds)
            ->where('tanggal', $today)
            ->get()
            ->keyBy('jadwal_id');

        // MERGE LOGIC
        $mergedJadwal = [];
        $currentBlock = null;

        foreach ($jadwalHariIni as $j) {
            if (!$j->jam) continue;

            $jamMulai = substr($j->jam->jam_mulai, 0, 5);
            $jamSelesai = substr($j->jam->jam_selesai, 0, 5);
            $kodeJam = $j->jam->nama; // e.g., J-1, J-2

            // Check if this specific jadwal_id is marked as completed in AbsenKelas
            $isCompleted = false;
            // AbsenKelas tracks PER JADWAL ID. 
            // If any schedule in the block is marked finished, the block is effectively "in progress" or "partially done"
            // But conceptually, one journal entry covers the whole block.
            // Usually, we check if the first or any 'representative' jadwal has an entry.
            if (isset($absenKelasRecords[$j->id]) && $absenKelasRecords[$j->id]->is_selesai) {
                $isCompleted = true;
            }

            // Init current block if null
            if (!$currentBlock) {
                $currentBlock = [
                    'id' => $j->id, 
                    'kodeMulai' => $kodeJam,
                    'kodeSelesai' => $kodeJam,
                    'waktuMulai' => $jamMulai,
                    'waktuAkhir' => $jamSelesai,
                    'jurusan' => $j->kelas->nama ?? '-', 
                    'mapel' => $j->mapel->nama ?? '-',
                    'jp_count' => 1,
                    'status' => $isCompleted ? 'selesai' : 'berlangsung',
                    // Internal check
                    'kelas_id' => $j->kelas_id,
                    'mapel_id' => $j->mapel_id,
                ];
                continue;
            }

            // Check merge condition: Same Kelas AND Same Mapel
            if ($j->kelas_id == $currentBlock['kelas_id'] && $j->mapel_id == $currentBlock['mapel_id']) {
                // Extend
                $currentBlock['kodeSelesai'] = $kodeJam;
                $currentBlock['waktuAkhir'] = $jamSelesai;
                $currentBlock['jp_count'] += 1;
                
                // If any part of the block is completed, mark status as finished?
                if ($isCompleted) {
                    $currentBlock['status'] = 'selesai';
                }
            } else {
                // Formatting JP string before pushing
                $currentBlock['jp'] = $currentBlock['jp_count'] . ' JP';
                unset($currentBlock['jp_count']);
                unset($currentBlock['kelas_id']);
                unset($currentBlock['mapel_id']);

                $mergedJadwal[] = $currentBlock;

                // Start new
                $currentBlock = [
                    'id' => $j->id, 
                    'kodeMulai' => $kodeJam,
                    'kodeSelesai' => $kodeJam,
                    'waktuMulai' => $jamMulai,
                    'waktuAkhir' => $jamSelesai,
                    'jurusan' => $j->kelas->nama ?? '-',
                    'mapel' => $j->mapel->nama ?? '-',
                    'jp_count' => 1,
                    'status' => $isCompleted ? 'selesai' : 'berlangsung',
                    'kelas_id' => $j->kelas_id,
                    'mapel_id' => $j->mapel_id,
                ];
            }
        }

        if ($currentBlock) {
             $currentBlock['jp'] = $currentBlock['jp_count'] . ' JP';
             unset($currentBlock['jp_count']);
             unset($currentBlock['kelas_id']);
             unset($currentBlock['mapel_id']);
             $mergedJadwal[] = $currentBlock;
        }

        return response()->json([
            'success' => true,
            'data' => $mergedJadwal,
        ]);
    }

    /**
     * Get Detail Jadwal (TodayPage)
     */
    public function show($id)
    {
        $user = Auth::user();
        if ($user->profile_type !== 'App\\Models\\Guru' || !$user->profile_id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }
        $guru = Guru::find($user->profile_id);

        $jadwal = Jadwal::with(['jam', 'kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->where('is_active', true)
            ->find($id);

        if (!$jadwal) {
            return response()->json(['success' => false, 'message' => 'Jadwal tidak ditemukan'], 404);
        }

        $today = Carbon::today()->toDateString();
        
        // Cek AbsenKelas hari ini
        $absenKelas = AbsenKelas::where('jadwal_id', $id)
            ->where('tanggal', $today)
            ->first();

        // 1. Attendance Stats (Dummy or Real)
        // Logic: Count from AbsenJp detail if exists, else 0
        // Need to know total students in class
        // Assuming we count Total Students from Siswa model or similar.
        // For now, let's look for real data if implemented, otherwise 0.
        // We haven't implemented Student Attendance Input yet, so these likely 0.
        // We can count total students in class.
        $totalSiswa = \App\Models\Siswa::where('rombel_saat_ini', $jadwal->kelas_id)->count();
        
        // Count attendance from AbsenJp -> AbsenJpDetail if exists
        // (Assuming tables exist from previous check)
        $hadir = 0; $sakit = 0; $izin = 0; $alfa = 0;
        
        // Try to fetch real counts
        try {
            // Priority 1: Check AbsenJpTemporary (Draft/Today's specific session)
            $tempStats = \Illuminate\Support\Facades\DB::table('absen_jp_temporary')
                ->where('jadwal_id', $id)
                ->where('tanggal', $today)
                ->join('jenis_absen', 'absen_jp_temporary.status_id', '=', 'jenis_absen.id')
                ->select('jenis_absen.nama', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
                ->groupBy('jenis_absen.nama')
                ->pluck('total', 'nama');

            if ($tempStats->isNotEmpty()) {
                // Normalize keys to uppercase
                $tempStats = $tempStats->mapWithKeys(function ($val, $key) {
                    return [strtoupper($key) => $val];
                });

                $hadir = $tempStats['HADIR'] ?? 0;
                $sakit = $tempStats['SAKIT'] ?? 0;
                $izin = $tempStats['IZIN'] ?? 0;
                $alfa = $tempStats['ALFA'] ?? ($tempStats['ALPHA'] ?? 0);
            } else {
                // Priority 2: Check AbsenJp (Finalized/Recap)
                $absenJpIds = \App\Models\AbsenJp::where('jadwal_id', $id)
                    ->where('tanggal', $today)
                    ->pluck('id');
                    
                if ($absenJpIds->isNotEmpty()) {
                    $stats = \Illuminate\Support\Facades\DB::table('absen_jp_detail')
                        ->whereIn('absen_jp_id', $absenJpIds)
                        ->join('jenis_absen', 'absen_jp_detail.jenis_absen_id', '=', 'jenis_absen.id')
                        ->select('jenis_absen.nama', \Illuminate\Support\Facades\DB::raw('sum(jumlah) as total'))
                        ->groupBy('jenis_absen.nama')
                        ->pluck('total', 'nama');
                    
                    // Normalize keys to uppercase
                    $stats = $stats->mapWithKeys(function ($val, $key) {
                        return [strtoupper($key) => $val];
                    });
                        
                    $hadir = $stats['HADIR'] ?? 0;
                    $sakit = $stats['SAKIT'] ?? 0;
                    $izin = $stats['IZIN'] ?? 0;
                    $alfa = $stats['ALFA'] ?? ($stats['ALPHA'] ?? 0);
                }
            }
        } catch (\Exception $e) {
            // Table might not exist or error
        }

        // 2. Previous Note
        // Logic: Get last AbsenKelas record before today for same mapel & kelas
        $prevNoteRecord = AbsenKelas::whereDate('tanggal', '<', $today)
             ->whereNotNull('catatan')
             ->where('catatan', '!=', '')
             ->whereHas('jadwal', function($q) use ($jadwal) {
                 $q->where('kelas_id', $jadwal->kelas_id)
                   ->where('mapel_id', $jadwal->mapel_id)
                   ->where('guru_id', $jadwal->guru_id); // Ensure same teacher
             })
             ->orderBy('tanggal', 'desc')
             ->first();

        // 3. Merging (to display range time correctly)
        // Find adjacent siblings (same Guru, Kelas, Mapel, Hari) to calculate full block session
        $siblings = Jadwal::with('jam')
            ->where('guru_id', $jadwal->guru_id)
            ->where('kelas_id', $jadwal->kelas_id)
            ->where('mapel_id', $jadwal->mapel_id)
            ->where('hari_id', $jadwal->hari_id)
            ->where('is_active', true)
            ->orderBy('jam_id')
            ->get();

        // Detect where the requested $id sits in the block to find the start and end of that specific continuous block
        $blockSchedules = [];
        $tempBlock = [];
        foreach ($siblings as $s) {
            if (empty($tempBlock)) {
                $tempBlock[] = $s;
            } else {
                $prev = end($tempBlock);
                // In this system, sequence is determined by jam_id (assuming ids are sequential/adjacent)
                // JAM sequence check: check if this JAM is immediately after precious JAM
                // (Using index/order if jam_id isn't guaranteed sequential, but JAM->nama J-1, J-2 is usually ordered)
                // For simplicity, we assume all siblings for same Guru/Kelas/Mapel on same day form a contiguous block.
                $tempBlock[] = $s;
            }
        }
        
        // If there are gaps, we should ideally split them, but typically Guru/Kelas/Mapel blocks are contiguous.
        // Let's assume contiguous for now as per image evidence showing J-3/J-4.
        $blockSchedules = $tempBlock; 
        
        $firstJam = $blockSchedules[0]->jam;
        $lastJam = end($blockSchedules)->jam;
        
        $codeRange = $blockSchedules[0]->jam->nama;
        if (count($blockSchedules) > 1) {
            $codeRange .= ' / ' . $lastJam->nama;
        }

        $totalJP = collect($blockSchedules)->sum(function($s) {
            return $s->jam->jumlah_jp;
        });

        $data = [
            'id' => $jadwal->id,
            'code' => $codeRange,
            'title' => $jadwal->kelas->nama,
            'subject' => $jadwal->mapel->nama,
            'range' => substr($firstJam->jam_mulai, 0, 5) . ' - ' . substr($lastJam->jam_selesai, 0, 5),
            'jp' => $totalJP . ' JP',
            'prevNote' => $prevNoteRecord ? $prevNoteRecord->catatan : strip_tags("Belum ada catatan sebelumnya."),
            'keterangan' => $absenKelas ? $absenKelas->catatan : '',
            'isOverdue' => false, 
            'isChecked' => $absenKelas && $absenKelas->is_selesai,
            'absenExists' => ($hadir + $sakit + $izin + $alfa) > 0,
            'attendance' => [
                'hadir' => $hadir,
                'sakit' => $sakit,
                'izin' => $izin,
                'alfa' => $alfa,
                'total' => $totalSiswa,
            ]
        ];

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Finish Class (Selesaikan Kelas)
     */
    public function finish(Request $request, $id)
    {
        $request->validate([
            'catatan' => 'nullable|string',
            'notes' => 'nullable|string', // Support for FE naming
            'confirm' => 'boolean' // Optional flag
        ]);

        $catatan = $request->catatan ?? $request->notes;

        \DB::beginTransaction();
        try {
            $today = Carbon::today()->toDateString();
            // Find/Create AbsenKelas
            $absenKelas = AbsenKelas::firstOrCreate(
                [
                    'jadwal_id' => $id, 
                    'tanggal' => $today
                ],
                [
                    'jam_masuk' => Carbon::now()->format('H:i:s'),
                ]
            );

            $absenKelas->catatan = $catatan;
            $absenKelas->is_selesai = true;
            $absenKelas->jam_pulang = Carbon::now()->format('H:i:s');
            $absenKelas->save();

            // RECAP LOGIC: Transfer from temporary to recap tables
            $tempAttendances = \App\Models\AbsenJpTemporary::where('jadwal_id', $id)
                ->where('tanggal', $today)
                ->where('status_absen', 'BELUM')
                ->get();

            $bulan = Carbon::today()->month;
            $jadwal = Jadwal::find($id);

            foreach ($tempAttendances as $temp) {
                // 1. Find or create the monthly recap header for this student/subject
                $recapHeader = \App\Models\AbsenJp::firstOrCreate(
                    [
                        'jadwal_id' => $id,
                        'siswa_id'  => $temp->siswa_id,
                        'bulan'     => $bulan,
                        'semester_id' => $jadwal->semester_id,
                    ],
                    [
                        'tanggal' => $today // Representative date
                    ]
                );

                // 2. Increment the count in the detail table
                $recapDetail = \App\Models\AbsenJpDetail::firstOrCreate(
                    [
                        'absen_jp_id' => $recapHeader->id,
                        'siswa_id'    => $temp->siswa_id,
                        'jenis_absen_id' => $temp->status_id,
                    ],
                    [
                        'jumlah' => 0
                    ]
                );

                $recapDetail->increment('jumlah');

                // 3. Mark temporary as SELESAI
                $temp->update(['status_absen' => 'SELESAI']);
            }

            \DB::commit();

            return response()->json([
                'success' => true, 
                'message' => 'Kelas berhasil diselesaikan dan absensi telah direkap',
                'data' => $absenKelas
            ]);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyelesaikan kelas: ' . $e->getMessage()
            ], 500);
        }
    }
}
