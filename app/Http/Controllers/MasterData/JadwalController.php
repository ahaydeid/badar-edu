<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Hari;
use App\Models\Jam;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index()
    {
        $activeSemester = Semester::where('tanggal_mulai', '<=', today())
            ->where('tanggal_selesai', '>=', today())
            ->first();

        return Inertia::render('MasterData/Jadwal/Index', [
            'kelas' => Kelas::with(['wali:id,nama'])->orderBy('tingkat')->orderBy('nama')->get(),
            'jadwal' => Jadwal::with([
                'hari:id,nama',
                'jam:id,nama,jam_mulai,jam_selesai',
                'kelas:id,nama',
                'guru:id,nama',
                'mapel:id,nama,warna_hex_mapel',
            ])
            ->where('semester_id', $activeSemester?->id)
            ->where('is_active', true) // Only show active schedules
            ->get(),
            'mapel' => Mapel::with(['guru:id,nama'])->get(),
            'hari' => Hari::where('status', 'ACTIVE')->orderBy('hari_ke')->get(),
            'jam' => Jam::where('status', 'ACTIVE')->orderBy('jam_mulai')->get(),
            'activeSemester' => $activeSemester,
        ]);
    }

    public function bulkSync(Request $request)
    {
        $request->validate([
            'changes' => 'required|array',
            'changes.*.hari_id' => 'required|exists:hari,id',
            'changes.*.jam_id' => 'required|exists:jam,id',
            'changes.*.kelas_id' => 'required|exists:kelas,id',
            'changes.*.mapel_id' => 'required|exists:mapel,id',
            'changes.*.guru_id' => 'required|exists:guru,id',
        ]);

        $activeSemester = Semester::where('tanggal_mulai', '<=', today())
            ->where('tanggal_selesai', '>=', today())
            ->first();

        if (!$activeSemester) {
            return back()->with('error', 'Tidak ada semester aktif saat ini.');
        }

        $versionService = new \App\Services\JadwalVersionService();
        $stats = [
            'created' => 0,
            'updated' => 0,
            'versioned' => 0,
        ];

        foreach ($request->changes as $change) {
            // Find existing jadwal for this slot
            $existing = Jadwal::where('hari_id', $change['hari_id'])
                ->where('jam_id', $change['jam_id'])
                ->where('kelas_id', $change['kelas_id'])
                ->where('semester_id', $activeSemester->id)
                ->where('is_active', true)
                ->first();

            if (!$existing) {
                // Slot kosong - Create new jadwal
                Jadwal::create([
                    'hari_id' => $change['hari_id'],
                    'jam_id' => $change['jam_id'],
                    'kelas_id' => $change['kelas_id'],
                    'mapel_id' => $change['mapel_id'],
                    'guru_id' => $change['guru_id'],
                    'semester_id' => $activeSemester->id,
                    'version' => 1,
                    'is_active' => true,
                ]);
                $stats['created']++;
            } else {
                // Jadwal sudah ada - cek apakah perlu diubah
                $needsUpdate = $existing->mapel_id != $change['mapel_id'] || 
                               $existing->guru_id != $change['guru_id'];

                if (!$needsUpdate) {
                    continue; // Tidak ada perubahan, skip
                }

                // Cek apakah ada data absensi
                $canUpdate = $versionService->canUpdate($existing->id);

                if ($canUpdate['can_update']) {
                    // Aman untuk update langsung (belum ada absensi)
                    $existing->update([
                        'mapel_id' => $change['mapel_id'],
                        'guru_id' => $change['guru_id'],
                    ]);
                    $stats['updated']++;
                } else {
                    // Ada absensi - buat versi baru
                    $versionService->createNewVersion(
                        jadwalId: $existing->id,
                        newData: [
                            'mapel_id' => $change['mapel_id'],
                            'guru_id' => $change['guru_id'],
                        ],
                        effectiveDate: today()
                    );
                    $stats['versioned']++;
                }
            }
        }

        // Build success message
        $messages = [];
        if ($stats['created'] > 0) {
            $messages[] = "{$stats['created']} jadwal baru dibuat";
        }
        if ($stats['updated'] > 0) {
            $messages[] = "{$stats['updated']} jadwal diperbarui";
        }
        if ($stats['versioned'] > 0) {
            $messages[] = "{$stats['versioned']} jadwal dibuat versi baru (ada data absensi)";
        }

        $message = count($messages) > 0 
            ? 'Berhasil: ' . implode(', ', $messages) . '.'
            : 'Tidak ada perubahan yang disimpan.';

        return redirect()->route('master-data.jadwal.index')->with('success', $message);
    }

    public function destroy(Jadwal $jadwal)
    {
        $versionService = new \App\Services\JadwalVersionService();
        
        // Cek apakah jadwal ini bisa dihapus
        $canUpdate = $versionService->canUpdate($jadwal->id);
        
        if (!$canUpdate['can_update']) {
            return back()->with('error', 
                'Jadwal tidak dapat dihapus karena sudah memiliki data absensi. ' .
                'Data absensi harus dilindungi untuk keperluan audit dan pelaporan.'
            );
        }
        
        // Aman untuk dihapus (belum ada absensi)
        $jadwal->delete();
        
        return back()->with('success', 'Jadwal berhasil dihapus');
    }
}
