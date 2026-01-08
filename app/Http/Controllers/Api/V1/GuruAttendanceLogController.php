<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AbsenGuru;
use App\Models\Guru;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GuruAttendanceLogController extends Controller
{
    /**
     * Get Guru Attendance Log
     * 
     * Query Parameters:
     * - start_date (required): YYYY-MM-DD
     * - end_date (required): YYYY-MM-DD
     */
    public function index(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // Get authenticated guru
        $user = Auth::user();
        
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

        // Get attendance logs
        $logs = AbsenGuru::with('status')
            ->where('guru_id', $guru->id)
            ->whereBetween('tanggal', [$request->start_date, $request->end_date])
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(function($absen) {
                $date = Carbon::parse($absen->tanggal);
                $dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                
                // Determine status display
                $statusName = 'Tidak Hadir';
                if ($absen->status) {
                    $statusName = ucfirst(strtolower($absen->status->nama));
                }
                
                return [
                    'tanggal' => $absen->tanggal,
                    'hari' => $dayNames[$date->dayOfWeek],
                    'jamMasuk' => $absen->jam_masuk ? substr($absen->jam_masuk, 0, 5) : '-',
                    'jamPulang' => $absen->jam_pulang ? substr($absen->jam_pulang, 0, 5) : '-',
                    'totalJp' => $absen->jp_total ?? 0,
                    'status' => $statusName,
                ];
            });

        // Calculate statistics
        $hadir = $logs->where('status', 'Hadir')->count();
        $terlambat = 0; // TODO: Implement late detection logic based on jam_masuk
        $tidakHadir = $logs->whereNotIn('status', ['Hadir'])->count();
        
        $stats = [
            'total' => $logs->count(),
            'hadir' => $hadir,
            'terlambat' => $terlambat,
            'tidakHadir' => $tidakHadir,
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'logs' => $logs->values(),
                'stats' => $stats,
            ]
        ]);
    }
}
