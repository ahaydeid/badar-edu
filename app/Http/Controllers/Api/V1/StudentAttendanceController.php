<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AbsenJp;
use App\Models\Jadwal;
use App\Models\JenisAbsen;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentAttendanceController extends Controller
{
    /**
     * Get Students for Attendance
     */
    public function getStudents($jadwal_id)
    {
        $user = Auth::user();
        
        // Verify guru access
        if ($user->profile_type !== 'App\\Models\\Guru' || !$user->profile_id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Get jadwal and verify ownership
        $jadwal = Jadwal::where('id', $jadwal_id)
            ->where('guru_id', $user->profile_id)
            ->where('is_active', true)
            ->with('kelas')
            ->first();

        if (!$jadwal) {
            return response()->json(['success' => false, 'message' => 'Jadwal tidak ditemukan'], 404);
        }

        $today = Carbon::today()->toDateString();
        
        $studentData = [];

        // Get all students in this class
        $students = Siswa::where('rombel_saat_ini', $jadwal->kelas_id)
            ->orderBy('nama')
            ->get(['id', 'nama']);

        // Check if temporary attendance records exist for today
        $absenRecords = \DB::table('absen_jp_temporary')
            ->where('jadwal_id', $jadwal_id)
            ->where('tanggal', $today)
            ->join('jenis_absen', 'absen_jp_temporary.status_id', '=', 'jenis_absen.id')
            ->select('absen_jp_temporary.siswa_id', 'jenis_absen.nama as status_name')
            ->get()
            ->keyBy('siswa_id');

        foreach ($students as $student) {
            $status = '';
            if (isset($absenRecords[$student->id])) {
                $status = $this->mapStatusToLetter($absenRecords[$student->id]->status_name);
            }

            $studentData[] = [
                'id' => $student->id,
                'name' => $student->nama,
                'status' => $status
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $studentData
        ]);
    }

    /**
     * Save Attendance
     */
    public function saveAttendance(Request $request, $jadwal_id)
    {
        $request->validate([
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|integer',
            'attendance.*.status' => 'required|in:H,S,I,A'
        ]);

        $user = Auth::user();
        
        // Verify guru access
        if ($user->profile_type !== 'App\\Models\\Guru' || !$user->profile_id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Get jadwal and verify ownership
        $jadwal = Jadwal::where('id', $jadwal_id)
            ->where('guru_id', $user->profile_id)
            ->where('is_active', true)
            ->first();

        if (!$jadwal) {
            return response()->json(['success' => false, 'message' => 'Jadwal tidak ditemukan'], 404);
        }

        $today = Carbon::today()->toDateString();
        $bulan = Carbon::today()->month;

        \DB::beginTransaction();
        try {
            // Get jenis_absen mapping (Case-insensitive)
            $jenisAbsenMap = JenisAbsen::all()->mapWithKeys(function ($item) {
                return [strtoupper($item->nama) => $item->id];
            })->toArray();

            // Process each student's attendance (Save to Temporary)
            foreach ($request->attendance as $item) {
                $statusName = $this->mapLetterToStatus($item['status']);
                $jenisAbsenId = $jenisAbsenMap[strtoupper($statusName)] ?? null;

                // Fallback for ALPHA/ALFA mismatch
                if (!$jenisAbsenId && strtoupper($statusName) === 'ALFA') {
                    $jenisAbsenId = $jenisAbsenMap['ALPHA'] ?? null;
                }

                if (!$jenisAbsenId) {
                    continue; // Skip if status not found
                }

                // Save to temporary table for daily transaction
                \App\Models\AbsenJpTemporary::updateOrCreate(
                    [
                        'jadwal_id' => $jadwal_id,
                        'siswa_id' => $item['student_id'],
                        'tanggal' => $today,
                    ],
                    [
                        'jam_masuk' => now()->format('H:i:s'),
                        'status_id' => $jenisAbsenId,
                        'status_absen' => 'BELUM', // Will be SELESAI when class is finished
                    ]
                );
            }

            // Ensure AbsenKelas (session header) exists
            \App\Models\AbsenKelas::firstOrCreate(
                [
                    'jadwal_id' => $jadwal_id,
                    'tanggal'   => $today,
                ],
                [
                    'jam_masuk'  => now()->format('H:i:s'),
                    'is_selesai' => false,
                ]
            );

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Absensi berhasil disimpan'
            ]);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan absensi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Map status name to letter (H/S/I/A)
     */
    private function mapStatusToLetter($statusName)
    {
        $map = [
            'HADIR' => 'H',
            'SAKIT' => 'S',
            'IZIN' => 'I',
            'ALFA' => 'A',
            'ALPHA' => 'A',
        ];

        return $map[strtoupper($statusName)] ?? '';
    }

    /**
     * Map letter to status name
     */
    private function mapLetterToStatus($letter)
    {
        $map = [
            'H' => 'HADIR',
            'S' => 'SAKIT',
            'I' => 'IZIN',
            'A' => 'ALFA',
        ];

        return $map[strtoupper($letter)] ?? 'HADIR';
    }
}
