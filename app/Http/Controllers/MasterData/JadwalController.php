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
                'mapel:id,nama',
            ])
            ->where('semester_id', $activeSemester?->id)
            ->get(),
            'mapel' => Mapel::with(['guru:id,nama'])->get(),
            'hari' => Hari::orderBy('hari_ke')->get(),
            'jam' => Jam::orderBy('jam_mulai')->get(),
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

        foreach ($request->changes as $change) {
            Jadwal::updateOrCreate(
                [
                    'hari_id' => $change['hari_id'],
                    'jam_id' => $change['jam_id'],
                    'kelas_id' => $change['kelas_id'],
                    'semester_id' => $activeSemester->id,
                ],
                [
                    'mapel_id' => $change['mapel_id'],
                    'guru_id' => $change['guru_id'],
                ]
            );
        }

        return redirect()->route('master-data.jadwal.index')->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Jadwal $jadwal)
    {
        $jadwal->delete();
        return back()->with('success', 'Jadwal berhasil dihapus');
    }
}
