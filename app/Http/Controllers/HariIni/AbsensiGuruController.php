<?php

namespace App\Http\Controllers\HariIni;

use App\Http\Controllers\Controller;
use App\Models\AbsenGuru;
use App\Models\Jadwal;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AbsensiGuruController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // 1. Hari hari ini (Senin = 1 ... Minggu = 7)
        $hariKe = $today->isoWeekday();
        $hariId = DB::table('hari')
            ->where('hari_ke', $hariKe)
            ->value('id');

        // 2. Semester aktif berdasarkan tanggal
        $semesterId = Semester::whereDate('tanggal_mulai', '<=', $today)
            ->whereDate('tanggal_selesai', '>=', $today)
            ->value('id');

        // 3. Query utama (START DARI JADWAL)
        $items = Jadwal::query()
            ->select([
                'guru.id as guru_id',
                'guru.nama',
                'mapel.nama as mapel',
                DB::raw('MIN(jam.jam_mulai) as jadwal_mulai'),
                DB::raw('MAX(jam.jam_selesai) as jadwal_selesai'),
                'absen_guru.jam_masuk',
                'absen_guru.jam_pulang',
                'absen_guru.metode_absen',
                'absen_guru.latitude',
                'absen_guru.longitude',
                'absen_guru.foto_selfie',
                'absen_guru.status_verifikasi',
                'absen_guru.is_in_range',
                'jenis_absen.nama as status_absen',
            ])
            ->join('guru', 'guru.id', '=', 'jadwal.guru_id')
            ->join('mapel', 'mapel.id', '=', 'jadwal.mapel_id')
            ->join('jam', 'jam.id', '=', 'jadwal.jam_id')
            ->leftJoin('absen_guru', function ($join) use ($today) {
                $join->on('absen_guru.guru_id', '=', 'jadwal.guru_id')
                     ->whereDate('absen_guru.tanggal', $today);
            })
            ->leftJoin('jenis_absen', 'jenis_absen.id', '=', 'absen_guru.status_id')
            ->where('jadwal.hari_id', $hariId)
            ->where('jadwal.semester_id', $semesterId)
            ->groupBy(
                'guru.id',
                'guru.nama',
                'mapel.nama',
                'absen_guru.jam_masuk',
                'absen_guru.jam_pulang',
                'absen_guru.metode_absen',
                'absen_guru.latitude',
                'absen_guru.longitude',
                'absen_guru.foto_selfie',
                'absen_guru.status_verifikasi',
                'absen_guru.is_in_range',
                'jenis_absen.nama'
            )
            ->orderBy('guru.nama')
            ->get()
            ->map(function ($row) {
                return [
                    'id'          => $row->guru_id,
                    'nama'        => $row->nama,
                    'mapel'       => $row->mapel,
                    'jadwal'      => substr($row->jadwal_mulai, 0, 5)
                                   . '-' .
                                   substr($row->jadwal_selesai, 0, 5),
                    'jamMasuk'    => $row->jam_masuk,
                    'jamPulang'   => $row->jam_pulang,
                    'status'      => $row->status_absen ?? 'BELUM ABSEN',
                    'metodeAbsen' => $row->metode_absen,
                    'lat'         => $row->latitude,
                    'lng'         => $row->longitude,
                    'foto'        => $row->foto_selfie ? asset('storage/' . $row->foto_selfie) : null,
                    'verifikasi'  => $row->status_verifikasi,
                    'isInRange'   => (bool)$row->is_in_range,
                ];
            });

        return Inertia::render('Hari-Ini/Absensi-Guru/Index', [
            'items' => $items,
        ]);
    }

    public function verify(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:APPROVED,REJECTED',
        ]);

        $absen = AbsenGuru::where('guru_id', $id)
            ->whereDate('tanggal', Carbon::today())
            ->firstOrFail();

        $absen->update([
            'status_verifikasi' => $request->status,
            'verified_by' => auth()->id(),
            'verified_at' => Carbon::now(),
            'status_id' => $request->status === 'APPROVED' ? 1 : 4, // 1=HADIR, 4=ALFA/DITOLAK (cek jenis_absen)
        ]);

        return back()->with('success', 'Status absensi berhasil diperbarui.');
    }
}
