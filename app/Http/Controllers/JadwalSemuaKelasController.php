<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Jadwal;
use App\Models\Semester;
use Carbon\Carbon;
use Inertia\Inertia;

class JadwalSemuaKelasController extends Controller
{
    public function index()
    {
        $kelasList = Kelas::with(['wali'])
        ->withCount(['siswa as jumlah_siswa'])
        ->orderBy('nama')
        ->get()
        ->map(fn ($k) => [
            'id' => $k->id,
            'nama_rombel' => $k->nama,
            'wali_nama' => $k->wali?->nama,
            'jumlah_siswa' => $k->jumlah_siswa,
        ])
        ->values();

        return Inertia::render('Akademik/JadwalSemuaKelas/Index', [
            'kelasList' => $kelasList,
        ]);
    }

    public function show(int $kelasId)
    {
        $today = Carbon::today();

        $semesterId = Semester::whereDate('tanggal_mulai', '<=', $today)
            ->whereDate('tanggal_selesai', '>=', $today)
            ->value('id');

        $kelas = Kelas::with('wali')->findOrFail($kelasId);

        $siswa = \App\Models\Siswa::where('rombel_saat_ini', $kelasId)
            ->orderBy('nama')
            ->get(['id', 'nama', 'jenis_kelamin']);

        if (!$semesterId) {
            return Inertia::render('Akademik/JadwalSemuaKelas/components/DetailKelas', [
                'jadwal' => [],
                'kelas'  => $kelas->nama,
                'wali'   => $kelas->wali?->nama ?? '-',
                'siswa'  => $siswa,
            ]);
        }

        $jadwal = Jadwal::with(['hari', 'jam', 'mapel'])
            ->where('kelas_id', $kelasId)
            ->where('semester_id', $semesterId)
            ->orderBy('hari_id')
            ->orderBy('jam_id')
            ->get()
            ->map(fn ($j) => [
                'hari'        => $j->hari->nama,
                'jam_mulai'   => substr($j->jam->jam_mulai, 0, 5),
                'jam_selesai' => substr($j->jam->jam_selesai, 0, 5),
                'mapel'       => $j->mapel->nama,
                'warna'       => $j->mapel->warna_hex_mapel ?? '#334155',
            ])
            ->groupBy('hari')
            ->map(fn ($items) => $items->values())
            ->toArray();

        return Inertia::render('Akademik/JadwalSemuaKelas/components/DetailKelas', [
            'jadwal' => $jadwal,
            'kelas'  => $kelas->nama,
            'wali'   => $kelas->wali?->nama ?? '-',
            'siswa'  => $siswa,
        ]);
    }

}
