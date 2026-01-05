<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\KegiatanKhusus;
use App\Models\KegiatanTahunan;
use Carbon\Carbon;
use Illuminate\Http\Request;

class KaldikController extends Controller
{
    public function index(Request $request)
    {
        // Filter parameters
        $filterMonth = $request->query('month'); // 1-12
        $filterYear = $request->query('year');   // e.g. 2026

        // Default range logic (similar to existing controller but scoped if filters exist)
        $nowYear = $filterYear ? (int)$filterYear : (int) date('Y');
        
        // If specific year is requested, only fetch for that year. 
        // Otherwise fetch current, prev, next (as per original logic to ensure coverage)
        $years = $filterYear ? [$nowYear] : [$nowYear - 1, $nowYear, $nowYear + 1];

        $events = [];
        $id = 1;

        // 1) Kegiatan Tahunan
        // We fetch all active annual events, then generate dates for the target years
        $tahunan = KegiatanTahunan::query()
            ->where('status', 'ACTIVE')
            ->get();

        foreach ($years as $year) {
            foreach ($tahunan as $row) {
                if ((int) $row->tanggal <= 0 || (int) $row->bulan <= 0) {
                    continue; // Skip invalid dates
                }

                // Create Carbon date
                try {
                    $date = Carbon::create($year, (int) $row->bulan, (int) $row->tanggal);
                } catch (\Exception $e) {
                    continue; // Skip invalid dates
                }
                
                // Filter by month if specified
                if ($filterMonth && $date->month != $filterMonth) {
                    continue;
                }

                $events[] = [
                    'id' => $id++,
                    'tanggal' => $date->format('Y-m-d'),
                    'kegiatan' => $row->nama,
                    'hari_efektif' => (bool) $row->is_hari_efektif,
                    'kategori' => $row->kategori,
                    // 'sumber' => 'TAHUNAN', // Internal debugging info, maybe not needed for API consumer unless requested
                ];
            }
        }

        // 2) Kegiatan Khusus
        // These have specific start/end dates. We check if they fall into the requested years/month.
        $khususQuery = KegiatanKhusus::query()->where('status', 'ACTIVE');
        
        // Optimization: Filter by year/month at DB level if possible, 
        // but since logic expands ranges, it's safer to fetch and expand then filter, 
        // OR filter strictly by intersection. 
        // For simplicity and consistency with original controller, let's fetch valid ones.
        // We can optimize by year though.
        $khususQuery->whereIn('tahun', $years);

        $khusus = $khususQuery->get();

        foreach ($khusus as $row) {
            $start = Carbon::parse($row->tanggal_mulai)->startOfDay();
            $end = Carbon::parse($row->tanggal_selesai)->startOfDay();

            // Expand date range
            for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
                
                // Filter by requested Year
                if ($filterYear && $d->year != $filterYear) {
                    continue;
                }

                // Filter by requested Month
                if ($filterMonth && $d->month != $filterMonth) {
                    continue;
                }

                $events[] = [
                    'id' => $id++,
                    'tanggal' => $d->format('Y-m-d'),
                    'kegiatan' => $row->nama,
                    'hari_efektif' => (bool) $row->is_hari_efektif,
                    'kategori' => $row->kategori,
                    // 'sumber' => 'KHUSUS',
                ];
            }
        }

        // Sort by date
        usort($events, function ($a, $b) {
            return strcmp($a['tanggal'], $b['tanggal']);
        });

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }
}
