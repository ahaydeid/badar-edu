<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\GeofenceHelper;
use App\Models\AbsenGuru;
use App\Models\AbsenLokasiKantor;
use App\Models\Jadwal;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AttendanceController extends Controller
{
    public function checkIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'foto' => 'required|image|max:2048', // Max 2MB
        ]);

        $user = $request->user();
        if ($user->profile_type !== 'App\Models\Guru' || !$user->profile_id) {
            return response()->json(['message' => 'Hanya akun Guru yang bisa melakukan absen.'], 403);
        }

        $guruId = $user->profile_id;
        $today = Carbon::today();
        
        // 1. Cari Jadwal Pertama Hari Ini
        $hariKe = $today->isoWeekday();
        $hariId = DB::table('hari')->where('hari_ke', $hariKe)->value('id');
        $semesterId = Semester::whereDate('tanggal_mulai', '<=', $today)
            ->whereDate('tanggal_selesai', '>=', $today)
            ->value('id');

        $jadwal = Jadwal::where('guru_id', $guruId)
            ->where('hari_id', $hariId)
            ->where('semester_id', $semesterId)
            ->where('is_active', true)
            ->first();

        if (!$jadwal) {
            return response()->json(['message' => 'Anda tidak memiliki jadwal mengajar hari ini.'], 400);
        }

        // 2. Cek Geofence
        $locations = AbsenLokasiKantor::where('is_active', true)->get();
        $isInRange = GeofenceHelper::isInRange($request->latitude, $request->longitude, $locations);

        // 3. Simpan Foto
        $path = $request->file('foto')->store('absensi', 'public');

        // 4. Simpan/Update Absen
        $absen = AbsenGuru::updateOrCreate(
            [
                'guru_id' => $guruId,
                'tanggal' => $today->toDateString(),
            ],
            [
                'jadwal_id' => $jadwal->id,
                'jam_masuk' => Carbon::now()->toTimeString(),
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'foto_selfie' => $path,
                'metode_absen' => 'geo',
                'is_in_range' => $isInRange,
                'status_verifikasi' => $isInRange ? 'AUTO' : 'PENDING',
                'status_id' => 1, // Anggap 1 adalah 'HADIR' (perlu dicek di jenis_absen)
            ]
        );

        return response()->json([
            'message' => $isInRange ? 'Absen berhasil!' : 'Lokasi di luar jangkauan, absen menunggu persetujuan admin.',
            'data' => $absen,
            'is_in_range' => $isInRange
        ]);
    }
}
