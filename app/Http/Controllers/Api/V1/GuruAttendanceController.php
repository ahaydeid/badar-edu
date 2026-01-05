<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AbsenGuru;
use App\Models\AbsenLokasiKantor;
use App\Models\Guru;
use App\Models\Jadwal;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class GuruAttendanceController extends Controller
{
    /**
     * Check-in (Absen Masuk)
     */
    public function checkIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'required|string', // Base64 encoded
            'timestamp' => 'nullable|date',
            'metode_absen' => 'nullable|in:geo,rfid,manual',
        ]);

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

        // Check duplikasi
        $existingAbsen = AbsenGuru::where('guru_id', $guru->id)
            ->where('tanggal', $today)
            ->whereNotNull('jam_masuk')
            ->first();

        if ($existingAbsen) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah absen masuk hari ini',
            ], 400);
        }

        // Get jadwal mengajar hari ini
        $hariIni = Carbon::now()->dayOfWeek; // 0 = Sunday, 1 = Monday, ...
        $hariId = $hariIni == 0 ? 7 : $hariIni; // Convert to 1-7 (Monday-Sunday)

        $jadwalHariIni = Jadwal::with(['jam', 'kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->where('hari_id', $hariId)
            ->orderBy('jam_id')
            ->get();

        // Determine jam_mulai_pertama
        $jamMulaiPertama = $jadwalHariIni->first()?->jam?->jam_mulai ?? '07:30:00';
        
        // GPS Validation
        $isInRange = $this->validateGPS($request->latitude, $request->longitude);

        // Save foto selfie
        $fotoPath = $this->saveFoto($request->photo, $guru->id, 'masuk');

        // Determine jam_masuk from timestamp or current time (Force Asia/Jakarta)
        $currentTime = $request->timestamp 
            ? Carbon::parse($request->timestamp)->setTimezone('Asia/Jakarta') 
            : Carbon::now('Asia/Jakarta');
            
        $jamMasuk = $currentTime->format('H:i:s');
        
        // Determine status (terlambat atau hadir)
        // Bandingkan menggunakan Carbon agar lebih presisi
        $timeMasuk = Carbon::createFromFormat('H:i:s', $jamMasuk);
        $timeMulai = Carbon::createFromFormat('H:i:s', $jamMulaiPertama);
        
        $isTerlambat = $timeMasuk->greaterThan($timeMulai);
        $statusId = $isTerlambat ? 5 : 1; // 5 = Terlambat, 1 = Hadir

        // Create absen record
        $absen = AbsenGuru::create([
            'guru_id' => $guru->id,
            'jadwal_id' => $jadwalHariIni->first()?->id, // First jadwal of the day
            'tanggal' => $today,
            'metode_absen' => $request->metode_absen ?? 'geo',
            'jam_masuk' => $jamMasuk,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'foto_selfie' => $fotoPath,
            'is_in_range' => $isInRange,
            'status_verifikasi' => $isInRange ? 'OTOMATIS' : 'PENDING',
            'status_id' => $statusId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Absen masuk berhasil',
            'data' => [
                'id' => $absen->id,
                'waktu_masuk' => $jamMasuk,
                'jadwal_mulai' => $jamMulaiPertama,
                'status_id' => $statusId,
                'is_terlambat' => $isTerlambat,
                'is_in_range' => $isInRange,
                'status_verifikasi' => $absen->status_verifikasi, // OTOMATIS atau PENDING
                'status' => $isTerlambat ? 'Terlambat' : 'Hadir',
            ],
        ]);
    }

    /**
     * Check-out (Absen Pulang)
     */
    public function checkOut(Request $request)
    {
        $request->validate([
            'timestamp' => 'nullable|date',
        ]);

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

        // Check sudah check-in?
        $absen = AbsenGuru::where('guru_id', $guru->id)
            ->where('tanggal', $today)
            ->whereNotNull('jam_masuk')
            ->first();

        if (!$absen) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum absen masuk hari ini',
            ], 400);
        }

        // Check sudah check-out?
        if ($absen->jam_pulang) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah absen pulang hari ini',
            ], 400);
        }

        // Get jadwal terakhir
        $hariIni = Carbon::now()->dayOfWeek;
        $hariId = $hariIni == 0 ? 7 : $hariIni;

        $jadwalTerakhir = Jadwal::with('jam')
            ->where('guru_id', $guru->id)
            ->where('hari_id', $hariId)
            ->orderBy('jam_id', 'desc')
            ->first();

        $jamSelesaiTerakhir = $jadwalTerakhir?->jam?->jam_selesai ?? '14:30:00';

        // Update jam_pulang
        $jamPulang = Carbon::now()->format('H:i:s');
        $absen->update([
            'jam_pulang' => $jamPulang,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Absen pulang berhasil',
            'data' => [
                'id' => $absen->id,
                'waktu_keluar' => $jamPulang,
                'jadwal_selesai' => $jamSelesaiTerakhir,
            ],
        ]);
    }

    /**
     * Get status absensi hari ini
     */
    public function today()
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

        // Get absensi hari ini
        $absen = AbsenGuru::where('guru_id', $guru->id)
            ->where('tanggal', $today)
            ->first();

        // Get jadwal mengajar hari ini
        $hariIni = Carbon::now()->dayOfWeek;
        $hariId = $hariIni == 0 ? 7 : $hariIni;

        $jadwalHariIni = Jadwal::with(['jam', 'kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->where('hari_id', $hariId)
            ->orderBy('jam_id')
            ->get();

        $jadwalFormatted = $jadwalHariIni->map(function ($j) {
            return [
                'id' => $j->id,
                'kelas' => $j->kelas->nama ?? '-',
                'mapel' => $j->mapel->nama ?? '-',
                'mulai' => substr($j->jam->jam_mulai ?? '00:00:00', 0, 5),
                'selesai' => substr($j->jam->jam_selesai ?? '00:00:00', 0, 5),
            ];
        });

        $jamMulaiPertama = $jadwalHariIni->first()?->jam?->jam_mulai ?? null;
        $jamSelesaiTerakhir = $jadwalHariIni->last()?->jam?->jam_selesai ?? null;

        return response()->json([
            'success' => true,
            'data' => [
                'sudah_masuk' => $absen && $absen->jam_masuk ? true : false,
                'waktu_masuk' => $absen?->jam_masuk ?? null,
                'waktu_keluar' => $absen?->jam_pulang ?? null,
                'is_terlambat' => $absen && $absen->status_id == 5 ? true : false,
                'status_id' => $absen?->status_id ?? null,
                'is_in_range' => $absen?->is_in_range ?? null,
                'status_verifikasi' => $absen?->status_verifikasi ?? null,
                'latitude' => $absen?->latitude ?? null,
                'longitude' => $absen?->longitude ?? null,
                'foto_url' => $absen && $absen->foto_selfie ? url('storage/' . $absen->foto_selfie) : null,
                'jadwal_hari_ini' => $jadwalFormatted,
                'jam_mulai_pertama' => $jamMulaiPertama ? substr($jamMulaiPertama, 0, 5) : null,
                'jam_selesai_terakhir' => $jamSelesaiTerakhir ? substr($jamSelesaiTerakhir, 0, 5) : null,
            ],
        ]);
    }

    public function getConfig()
    {
        $lokasi = AbsenLokasiKantor::where('is_active', true)->first();

        if (!$lokasi) {
            return response()->json([
                'success' => false,
                'message' => 'Konfigurasi lokasi belum diset',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'latitude' => $lokasi->latitude,
                'longitude' => $lokasi->longitude,
                'radius' => (int)$lokasi->radius,
                'is_active' => (bool)$lokasi->is_active,
            ]
        ]);
    }

    /**
     * Validate GPS using Haversine formula
     */
    private function validateGPS($lat, $lon)
    {
        $lokasi = AbsenLokasiKantor::where('is_active', true)->first();

        if (!$lokasi) {
            return true; // No location set, auto approve
        }

        $earthRadius = 6371000; // meters

        $latFrom = deg2rad($lokasi->latitude);
        $lonFrom = deg2rad($lokasi->longitude);
        $latTo = deg2rad($lat);
        $lonTo = deg2rad($lon);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos($latFrom) * cos($latTo) *
            sin($lonDelta / 2) * sin($lonDelta / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $distance = $earthRadius * $c; // Distance in meters

        return $distance <= $lokasi->radius;
    }

    /**
     * Save foto from base64
     */
    private function saveFoto($base64, $guruId, $type)
    {
        // Remove base64 prefix if exists
        if (preg_match('/^data:image\/(\w+);base64,/', $base64, $matches)) {
            $base64 = substr($base64, strpos($base64, ',') + 1);
            $extension = $matches[1];
        } else {
            $extension = 'jpg';
        }

        $image = base64_decode($base64);
        $today = Carbon::today()->toDateString();
        $timestamp = Carbon::now()->timestamp;
        $filename = "guru-{$guruId}-{$type}-{$timestamp}.{$extension}";
        $path = "attendance/{$today}/{$filename}";

        Storage::disk('public')->put($path, $image);

        return $path;
    }
}
