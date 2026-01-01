<?php

namespace App\Http\Controllers\PPDB;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PengaturanController extends Controller
{
    public function index()
    {
        $activePeriods = \App\Models\PpdbPeriod::with('jurusans')
            ->where('status', 'Aktif')
            ->orderBy('id', 'desc')
            ->get();
        
        $ppdbAktifList = [];
        $aggregatedQuota = [];

        foreach ($activePeriods as $activePeriod) {
            $ppdbAktifList[] = [
                'tahun' => $activePeriod->tahun_ajaran,
                'gelombang' => $activePeriod->gelombang,
                'periode' => $activePeriod->start_date->format('d M Y') . ' – ' . $activePeriod->end_date->format('d M Y'),
                'jurusan' => $activePeriod->jurusans->pluck('kode')->join(', '),
                'kuota' => $activePeriod->jurusans->sum('pivot.kuota'),
                'status' => $activePeriod->status,
                'deskripsi' => $activePeriod->deskripsi,
                // Valid Fields for Edit
                'id' => $activePeriod->id,
                'start_date_raw' => $activePeriod->start_date->format('Y-m-d'),
                'end_date_raw' => $activePeriod->end_date->format('Y-m-d'),
                'committee_name' => $activePeriod->committee_name,
                'jurusans_raw' => $activePeriod->jurusans->map(function($j) {
                    return [
                        'id' => $j->id,
                        'nama' => $j->nama_jurusan, 
                        'kuota' => $j->pivot->kuota
                    ];
                }),
            ];

            // Aggregate Quota logic
            foreach ($activePeriod->jurusans as $jurusan) {
                $kode = $jurusan->kode;
                if (!isset($aggregatedQuota[$kode])) {
                    $aggregatedQuota[$kode] = [
                        'jurusan' => $kode,
                        'kuota' => 0,
                        'terisi' => 0
                    ];
                }
                $aggregatedQuota[$kode]['kuota'] += $jurusan->pivot->kuota;
                $aggregatedQuota[$kode]['terisi'] += $jurusan->pivot->terisi;
            }
        }
        
        // Reset keys for Inertia
        $kuota = array_values($aggregatedQuota);

        $history = \App\Models\PpdbPeriod::with('jurusans')
            ->where('status', '!=', 'Aktif')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($period) {
                return [
                    'id' => $period->id,
                    'tahun' => $period->tahun_ajaran,
                    'gelombang' => $period->gelombang,
                    'periode' => $period->start_date->format('d M Y') . ' – ' . $period->end_date->format('d M Y'),
                    'jurusan' => $period->jurusans->pluck('kode')->join(', '),
                    'kuota' => $period->jurusans->sum('pivot.kuota'),
                    'status' => $period->status,
                ];
            });

        $allJurusans = \App\Models\Jurusan::select('id', 'nama', 'kode')->get();

        return Inertia::render('PPDB/Pengaturan/Index', [
            'ppdbAktifList' => $ppdbAktifList, // Renamed from ppdbAktif
            'kuota' => $kuota,
            'history' => $history,
            'allJurusans' => $allJurusans,
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'tahun_ajaran' => 'required',
            'gelombang' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'status' => 'required',
            'committee_name' => 'nullable|string|max:255',
            'jurusans' => 'required|array',
            'jurusans.*.id' => 'required|exists:jurusan,id',
            'jurusans.*.kuota' => 'required|integer|min:0',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
            // Create Period
            $period = \App\Models\PpdbPeriod::create([
                'tahun_ajaran' => $request->tahun_ajaran,
                'gelombang' => $request->gelombang,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => $request->status,
                'committee_name' => $request->committee_name,
                'deskripsi' => "PPDB {$request->tahun_ajaran} {$request->gelombang}",
            ]);

            // Attach Jurusans with Kuota
            foreach ($request->jurusans as $jurusan) {
                $period->jurusans()->attach($jurusan['id'], [
                    'kuota' => $jurusan['kuota'],
                    'terisi' => 0,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Periode PPDB berhasil dibuat.');
    }

    public function update(\Illuminate\Http\Request $request, $id)
    {
        $request->validate([
            'tahun_ajaran' => 'required',
            'gelombang' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'status' => 'required',
            'committee_name' => 'nullable|string|max:255',
            'jurusans' => 'required|array',
            'jurusans.*.id' => 'required|exists:jurusan,id',
            'jurusans.*.kuota' => 'required|integer|min:0',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($request, $id) {
            $period = \App\Models\PpdbPeriod::findOrFail($id);
            
            // Removed Constraint: Allow multiple active periods
            // if ($request->status === 'Aktif') { ... } 

            $period->update([
                'tahun_ajaran' => $request->tahun_ajaran,
                'gelombang' => $request->gelombang,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => $request->status,
                'committee_name' => $request->committee_name,
                'deskripsi' => "PPDB {$request->tahun_ajaran} {$request->gelombang}",
            ]);

            $syncData = [];
            foreach ($request->jurusans as $jurusan) {
                $existingPivot = $period->jurusans()->where('jurusan_id', $jurusan['id'])->first();
                $terisi = $existingPivot ? $existingPivot->pivot->terisi : 0;

                $syncData[$jurusan['id']] = [
                    'kuota' => $jurusan['kuota'],
                    'terisi' => $terisi, 
                ];
            }
            $period->jurusans()->sync($syncData);
        });

        return redirect()->back()->with('success', 'Periode PPDB berhasil diperbarui.');
    }
}
