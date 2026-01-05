<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Hari;
use App\Models\Jadwal;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GuruScheduleController extends Controller
{
    public function index()
    {
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

        // Get active semester
        $activeSemester = Semester::where('tanggal_mulai', '<=', today())
            ->where('tanggal_selesai', '>=', today())
            ->first();

        if (!$activeSemester) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada semester aktif',
            ], 404);
        }

        // Get days
        $days = Hari::orderBy('hari_ke')->get(['id', 'nama']);

        // Get schedules
        $schedules = Jadwal::with(['jam', 'kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->where('semester_id', $activeSemester->id)
            ->get();

        // Grouping logic: merge consecutive slots for the same class and mapel
        $groupedJadwals = [];
        $tempGrouped = [];

        // Group by day first
        foreach ($schedules as $s) {
            $tempGrouped[$s->hari_id][] = $s;
        }

        foreach ($tempGrouped as $hariId => $items) {
            // Sort by jam name/start time (assuming J-1, J-2 etc are ordered)
            usort($items, function ($a, $b) {
                return $a->jam->id <=> $b->jam->id;
            });

            $i = 0;
            while ($i < count($items)) {
                $current = $items[$i];
                $next = isset($items[$i + 1]) ? $items[$i + 1] : null;

                // Check if they can be merged: same kelas, same mapel, and sequential jam_id
                // Note: sequential jam_id check might be tricky if there's break in between
                // For now, let's assume they are merged if they are consecutive in the array for the same kelas/mapel
                if ($next && $current->kelas_id == $next->kelas_id && $current->mapel_id == $next->mapel_id && ($current->jam->id + 1 == $next->jam->id || $current->jam->nama == 'J-1' && $next->jam->nama == 'J-2')) {
                    // It seems they are consecutive (simple +1 check on ID might not work if J-3 is a break, but J-1 J-2 are before break)
                    // Let's refine the logic to check mapel & kelas
                    $groupedJadwals[] = [
                        'id' => $current->id,
                        'hari_id' => $hariId,
                        'jamMulai' => $current->jam->jam_mulai,
                        'jamSelesai' => $next->jam->jam_selesai,
                        'jamPertama' => $current->jam->nama,
                        'jamKedua' => $next->jam->nama,
                        'kelas' => [
                            'nama' => $current->kelas->nama ?? '-'
                        ]
                    ];
                    $i += 2; // skip next
                } else {
                    $groupedJadwals[] = [
                        'id' => $current->id,
                        'hari_id' => $hariId,
                        'jamMulai' => $current->jam->jam_mulai,
                        'jamSelesai' => $current->jam->jam_selesai,
                        'jamPertama' => $current->jam->nama,
                        'jamKedua' => null,
                        'kelas' => [
                            'nama' => $current->kelas->nama ?? '-'
                        ]
                    ];
                    $i++;
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'days' => $days,
                'jadwals' => $groupedJadwals,
            ],
        ]);
    }
}
