<?php

namespace App\Http\Controllers;

use App\Models\KegiatanKhusus;
use App\Models\KegiatanTahunan;
use Carbon\Carbon;
use Inertia\Inertia;

class KalendarAkademikController extends Controller
{
    public function index()
    {
        $nowYear = (int) date('Y');
        $years = [$nowYear - 1, $nowYear, $nowYear + 1];

        $events = [];
        $id = 1;

        // 1) Kegiatan Tahunan (dibuat tanggal untuk tiap tahun dalam range)
        $tahunan = KegiatanTahunan::query()
            ->where('status', 'ACTIVE')
            ->get();

        foreach ($years as $year) {
            foreach ($tahunan as $row) {
                // optional: kalau tanggal=0 (hari bergerak), skip biar tidak bikin tanggal invalid
                if ((int) $row->tanggal <= 0 || (int) $row->bulan <= 0) {
                    continue;
                }

                $tanggal = Carbon::create($year, (int) $row->bulan, (int) $row->tanggal)->format('Y-m-d');

                $events[] = [
                    'id' => $id++,
                    'tanggal' => $tanggal,
                    'kegiatan' => $row->nama,
                    'hari_efektif' => (bool) $row->is_hari_efektif,
                    'kategori' => $row->kategori,
                    'sumber' => 'TAHUNAN',
                    'ref_id' => $row->id,
                ];
            }
        }

        // 2) Kegiatan Khusus (expand per hari)
        $khusus = KegiatanKhusus::query()
            ->where('status', 'ACTIVE')
            ->get();

        foreach ($khusus as $row) {
            $start = Carbon::parse($row->tanggal_mulai)->startOfDay();
            $end = Carbon::parse($row->tanggal_selesai)->startOfDay();

            for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
                $events[] = [
                    'id' => $id++,
                    'tanggal' => $d->format('Y-m-d'),
                    'kegiatan' => $row->nama,
                    'hari_efektif' => (bool) $row->is_hari_efektif,
                    'kategori' => $row->kategori,
                    'sumber' => 'KHUSUS',
                    'ref_id' => $row->id,
                ];
            }
        }

        return Inertia::render('KalendarAkademik/Index', [
            'events' => $events,
        ]);
    }
}
