<?php

namespace App\Http\Controllers\HariIni;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\AbsenHarianSiswa;
use App\Models\AbsenJpTemporary;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Semester;
use Illuminate\Support\Facades\DB;

class KelasBerlangsungController extends Controller
{
    public function index()
    {
        $today  = Carbon::today();
        $hariKe = Carbon::now()->dayOfWeekIso;

        $semesterId = Semester::whereDate('tanggal_mulai', '<=', $today)
            ->whereDate('tanggal_selesai', '>=', $today)
            ->value('id');

        /**
         * 1. AMBIL JUMLAH SISWA PER KELAS
         */
        $jumlahSiswaPerKelas = Kelas::withCount('siswa')
            ->pluck('siswa_count', 'id')
            ->toArray();

        /**
         * 2. REKAP ABSEN SISWA HARI INI
         * DEFAULT: semua alfa
         */
        $rekapPerKelas = AbsenHarianSiswa::with('status:id,nama')
            ->whereDate('tanggal', $today)
            ->get()
            ->groupBy('kelas_id')
            ->map(function ($rows, $kelasId) use ($jumlahSiswaPerKelas) {
                $totalSiswa = $jumlahSiswaPerKelas[$kelasId] ?? 0;

                $base = [
                    'hadir' => 0,
                    'izin'  => 0,
                    'sakit' => 0,
                    'alfa'  => $totalSiswa,
                ];

                foreach ($rows as $r) {
                    $status = strtolower($r->status?->nama ?? '');

                    if (in_array($status, ['hadir','izin','sakit'], true)) {
                        $base[$status]++;
                        $base['alfa']--;
                    }
                }

                return $base;
            })
            ->toArray();

        /**
         * 3. STATUS JP HARI INI (absen_jp_temporary)
         */
        $jpStatus = AbsenJpTemporary::whereDate('tanggal', $today)
            ->get()
            ->groupBy('jadwal_id');

        /**
         * 4. KELAS + JADWAL HARI INI
         */
        $kelas = Kelas::with([
            'wali:id,nama',
            'jadwal' => function ($q) use ($hariKe, $semesterId) {
                $q->where('semester_id', $semesterId)
                ->whereHas('hari', fn ($h) => $h->where('hari_ke', $hariKe))
                ->with([
                    'guru:id,nama',
                    'mapel:id,nama',
                    'jam:id,jam_mulai,jam_selesai',
                ]);
            },
        ])->get();

        /**
         * 5. FORMAT KE VIEW
         */
        $result = $kelas->map(function ($k) use ($rekapPerKelas, $jumlahSiswaPerKelas, $jpStatus) {
            $totalSiswa = $jumlahSiswaPerKelas[$k->id] ?? 0;

            return [
                'id'    => $k->id,
                'kelas' => $k->nama,
                'wali'  => $k->wali?->nama,
                'siswa' => $rekapPerKelas[$k->id] ?? [
                    'hadir' => 0,
                    'izin'  => 0,
                    'sakit' => 0,
                    'alfa'  => $totalSiswa,
                ],
                'jadwal' => $k->jadwal
                    ->sortBy(fn ($j) => $j->jam->jam_mulai)
                    ->values()
                    ->reduce(function ($carry, $j) use ($jpStatus) {

                        $jp = $jpStatus[$j->id] ?? collect();

                        $status = 'belum';
                        if ($jp->isNotEmpty()) {
                            $status = $jp->first()->status_absen === 'BELUM'
                                ? 'berlangsung'
                                : 'selesai';
                        }

                        if ($carry->isEmpty()) {
                            return collect([[
                                'id' => $j->id,
                                'jam_mulai' => $j->jam->jam_mulai,
                                'jam_selesai' => $j->jam->jam_selesai,
                                'jam' => substr($j->jam->jam_mulai,0,5).' - '.substr($j->jam->jam_selesai,0,5),
                                'mapel' => $j->mapel?->nama,
                                'guru' => $j->guru?->nama,
                                'status' => $status,
                                'color' => null,
                                'hadir' => null,
                            ]]);
                        }

                        $lastIndex = $carry->keys()->last();
                        $last = $carry[$lastIndex];

                        $isSameMapel = $last['mapel'] === $j->mapel?->nama;
                        $isSameGuru  = $last['guru'] === $j->guru?->nama;
                        $isContinue  = $last['jam_selesai'] === $j->jam->jam_mulai;

                        if ($isSameMapel && $isSameGuru && $isContinue) {
                            $last['jam_selesai'] = $j->jam->jam_selesai;
                            $last['jam'] =
                                substr($last['jam_mulai'],0,5).' - '.substr($j->jam->jam_selesai,0,5);

                            if ($last['status'] !== 'berlangsung') {
                                $last['status'] = $status;
                            }

                            $carry[$lastIndex] = $last;
                        } else {
                            $carry->push([
                                'id' => $j->id,
                                'jam_mulai' => $j->jam->jam_mulai,
                                'jam_selesai' => $j->jam->jam_selesai,
                                'jam' => substr($j->jam->jam_mulai,0,5).' - '.substr($j->jam->jam_selesai,0,5),
                                'mapel' => $j->mapel?->nama,
                                'guru' => $j->guru?->nama,
                                'status' => $status,
                                'color' => null,
                                'hadir' => null,
                            ]);
                        }

                        return $carry;
                    }, collect())
                    ->values(),
            ];
        })->values();

        $detailAbsenPerKelas = AbsenHarianSiswa::with([
        'siswa:id,nama',
        'status:id,nama'
        ])
        ->whereDate('tanggal', $today)
        ->get()
        ->groupBy('kelas_id')
        ->map(function ($rows) {
            return $rows->map(function ($r) {
                return [
                    'id'        => $r->id,
                    'nama'      => $r->siswa?->nama,
                    'jamMasuk'  => $r->jam_masuk ? substr($r->jam_masuk,0,5) : '-',
                    'jamPulang' => $r->jam_pulang ? substr($r->jam_pulang,0,5) : '-',
                    'status'    => ucfirst(strtolower($r->status?->nama ?? 'Alfa')),
                ];
            })->values();
        })
        ->toArray();


       return Inertia::render('Hari-Ini/Kelas-Berlangsung/Index', [
            'items' => $result,
            'detailAbsen' => $detailAbsenPerKelas,
        ]);
    }
}
