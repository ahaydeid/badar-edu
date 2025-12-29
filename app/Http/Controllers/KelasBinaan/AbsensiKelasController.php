<?php

namespace App\Http\Controllers\KelasBinaan;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\AbsenHarianSiswa;
use App\Models\Semester;
use Illuminate\Support\Facades\Auth;


class AbsensiKelasController extends Controller
{
    public function index()
    {
       $waliKelasId = Auth::user()->profile_id;
        $today = now();

        $semester = Semester::whereDate('tanggal_mulai', '<=', $today)
            ->whereDate('tanggal_selesai', '>=', $today)
            ->firstOrFail();

        $kelas = Kelas::where('wali_guru_id', $waliKelasId)->firstOrFail();

        $siswa = Siswa::where('rombel_saat_ini', $kelas->id)
            ->orderBy('nama')
            ->get();

        $rekap = AbsenHarianSiswa::selectRaw("
                siswa_id,
                SUM(status_id = 1) as hadir,
                SUM(status_id = 2) as terlambat,
                SUM(status_id = 3) as sakit,
                SUM(status_id = 4) as izin,
                SUM(status_id = 5) as alfa
            ")
            ->where('kelas_id', $kelas->id)
            ->whereBetween('tanggal', [
                $semester->tanggal_mulai,
                $semester->tanggal_selesai
            ])
            ->groupBy('siswa_id')
            ->get()
            ->keyBy('siswa_id');

        $siswa = $siswa->map(function ($s) use ($rekap) {
            $r = $rekap[$s->id] ?? null;

            return [
                'id'        => $s->id,
                'nama'      => $s->nama,
                'foto'      => $s->foto,
                'hadir'     => $r->hadir ?? 0,
                'terlambat' => $r->terlambat ?? 0,
                'sakit'     => $r->sakit ?? 0,
                'izin'      => $r->izin ?? 0,
                'alfa'      => $r->alfa ?? 0,
            ];
        });

        return inertia('Akademik/KelasBinaan/AbsensiKelas/Index', [
            'kelas' => $kelas,
            'siswa' => $siswa,
        ]);
    }

    public function detail($siswaId)
    {
        $waliKelasId = Auth::user()->profile_id;
        $today = now();

        $semester = Semester::whereDate('tanggal_mulai', '<=', $today)
            ->whereDate('tanggal_selesai', '>=', $today)
            ->firstOrFail();

        $kelas = Kelas::where('wali_guru_id', $waliKelasId)->firstOrFail();

        return AbsenHarianSiswa::with('status')
            ->where('siswa_id', $siswaId)
            ->where('kelas_id', $kelas->id)
            ->whereBetween('tanggal', [
                $semester->tanggal_mulai,
                $semester->tanggal_selesai
            ])
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(fn ($r) => [
                'tanggal'    => $r->tanggal,
                'hadir'      => $r->status->kode === 'HADIR',
                'terlambat'  => $r->status->kode === 'TERLAMBAT',
                'sakit'      => $r->status->kode === 'SAKIT',
                'izin'       => $r->status->kode === 'IZIN',
                'alfa'       => $r->status->kode === 'ALFA',
            ]);
    }
}
