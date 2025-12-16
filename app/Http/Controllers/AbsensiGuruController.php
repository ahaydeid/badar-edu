<?php

namespace App\Http\Controllers;

use App\Models\AbsenGuru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbsensiGuruController extends Controller
{
    public function index()
    {
        $today = date('Y-m-d');

        $absen = AbsenGuru::with([
            'guru',
            'jadwal.mapel',
            'status'
        ])
        ->where('tanggal', $today)
        ->get()
        ->map(function ($item) {
            return [
                "id" => $item->id,
                "nama" => $item->guru->nama,
                "mapel" => $item->jadwal->mapel->nama ?? '-',
                "jadwalMasuk" => $item->jadwal->jam->jam_masuk ?? null,
                "jamMasuk" => $item->jam_masuk,
                "jamPulang" => $item->jam_pulang,
                "lat" => $item->latitude,
                "lng" => $item->longitude,
                "status" => $item->status->nama ?? "-",
                "metodeAbsen" => $item->metode_absen,
            ];
        });

        return Inertia::render("Hari-Ini/Absensi-Guru/Index", [
            "items" => $absen
        ]);
    }
}
