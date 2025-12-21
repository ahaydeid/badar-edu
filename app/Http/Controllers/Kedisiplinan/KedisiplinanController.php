<?php

namespace App\Http\Controllers\Kedisiplinan;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class KedisiplinanController extends Controller
{
    /* =====================================================
     * DASHBOARD
     * ===================================================== */
   public function dashboard()
    {
        $totalSiswa = DB::table('siswa')->count();

        $sanksiAktif = DB::table('sanksi_siswa')
            ->where('status', 'aktif')
            ->count();

        $rekapSanksi = DB::table('sanksi_siswa')
            ->join('jenis_sanksi', 'jenis_sanksi.id', '=', 'sanksi_siswa.jenis_sanksi_id')
            ->where('sanksi_siswa.status', 'aktif')
            ->select(
                'jenis_sanksi.nama',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('jenis_sanksi.nama')
            ->orderByDesc('total')
            ->get();

        return inertia('Kedisiplinan/Dashboard', [
            'totalSiswa' => $totalSiswa,
            'sanksiAktif' => $sanksiAktif,
            'rekapSanksi' => $rekapSanksi,
        ]);
    }

    /* =====================================================
     * SISWA PERLU TINDAKAN
     * ===================================================== */
    public function perluTindakan()
    {
        $siswa = DB::table('poin_siswa')
            ->join('siswa', 'siswa.id', '=', 'poin_siswa.siswa_id')
            ->leftJoin('sanksi_siswa', function ($join) {
                $join->on('sanksi_siswa.siswa_id', '=', 'siswa.id')
                    ->where('sanksi_siswa.status', 'aktif');
            })
            ->leftJoin('jenis_sanksi as js_aktif', 'js_aktif.id', '=', 'sanksi_siswa.jenis_sanksi_id')
            ->whereExists(function ($q) {
                $q->select(DB::raw(1))
                ->from('jenis_sanksi')
                ->whereColumn('poin_siswa.total_poin', '>=', 'jenis_sanksi.min_poin')
                ->where('jenis_sanksi.aktif', true);
            })
            ->select(
                'siswa.id',
                'siswa.nama',
                'poin_siswa.total_poin',
                'js_aktif.kode as sanksi_berjalan'
            )
            ->orderByDesc('poin_siswa.total_poin')
            ->get();

        $jenisSanksi = DB::table('jenis_sanksi')
            ->where('aktif', true)
            ->orderBy('min_poin')
            ->get();

        return inertia('Kedisiplinan/PerluTindakan/Index', [
            'siswa' => $siswa,
            'jenisSanksi' => $jenisSanksi,
        ]);
    }


    /* =====================================================
     * LIST SISWA (MONITORING)
     * ===================================================== */
   public function siswaIndex()
    {
        $siswa = DB::table('poin_siswa')
            ->join('siswa', 'siswa.id', '=', 'poin_siswa.siswa_id')
            ->leftJoin('sanksi_siswa', function ($join) {
                $join->on('sanksi_siswa.siswa_id', '=', 'siswa.id')
                    ->where('sanksi_siswa.status', 'aktif');
            })
            ->leftJoin('jenis_sanksi', 'jenis_sanksi.id', '=', 'sanksi_siswa.jenis_sanksi_id')
            ->where('poin_siswa.total_poin', '>', 0)
            ->select(
                'siswa.id',
                'siswa.nama',
                'poin_siswa.total_poin',
                'jenis_sanksi.nama as sanksi_nama',
                'jenis_sanksi.kode as sanksi_kode',
                'sanksi_siswa.tanggal_mulai',
                'sanksi_siswa.tanggal_selesai',
                DB::raw("
                    CASE 
                        WHEN sanksi_siswa.tanggal_selesai IS NOT NULL 
                        THEN DATEDIFF(sanksi_siswa.tanggal_selesai, CURDATE())
                        ELSE NULL
                    END as sisa_hari
                ")
            )
            ->orderByDesc('sanksi_siswa.tanggal_mulai')
            ->orderByDesc('poin_siswa.total_poin')
            ->get();

        return inertia('Kedisiplinan/Siswa/Index', [
            'siswa' => $siswa,
        ]);
    }

    /* =====================================================
     * DETAIL SISWA (HALAMAN KUNCI)
     * ===================================================== */
    public function siswaShow($siswaId)
    {
        // ===============================
        // PROFIL SISWA
        // ===============================
        $siswa = DB::table('siswa')
            ->where('id', $siswaId)
            ->first();

        // ===============================
        // TOTAL POIN AKTIF
        // ===============================
        $totalPoin = DB::table('poin_siswa')
            ->where('siswa_id', $siswaId)
            ->value('total_poin') ?? 0;

        // ===============================
        // SANKSI AKTIF (JIKA ADA)
        // ===============================
        $sanksiAktif = DB::table('sanksi_siswa')
            ->join('jenis_sanksi', 'jenis_sanksi.id', '=', 'sanksi_siswa.jenis_sanksi_id')
            ->where('sanksi_siswa.siswa_id', $siswaId)
            ->where('sanksi_siswa.status', 'aktif')
            ->select(
                'jenis_sanksi.id as jenis_sanksi_id',
                'jenis_sanksi.kode',
                'jenis_sanksi.nama',
                'jenis_sanksi.level',
                'sanksi_siswa.tanggal_mulai',
                'sanksi_siswa.tanggal_selesai'
            )
            ->first();

        // ===============================
        // RIWAYAT PELANGGARAN
        // ===============================
        $pelanggaran = DB::table('pelanggaran_siswa')
            ->join('jenis_pelanggaran', 'jenis_pelanggaran.id', '=', 'pelanggaran_siswa.jenis_pelanggaran_id')
            ->where('pelanggaran_siswa.siswa_id', $siswaId)
            ->select(
                'pelanggaran_siswa.tanggal',
                'jenis_pelanggaran.nama',
                'pelanggaran_siswa.poin',
                'pelanggaran_siswa.keterangan'
            )
            ->orderByDesc('pelanggaran_siswa.tanggal')
            ->get();

        // ===============================
        // RIWAYAT SANKSI
        // ===============================
        $riwayatSanksi = DB::table('sanksi_siswa')
            ->join('jenis_sanksi', 'jenis_sanksi.id', '=', 'sanksi_siswa.jenis_sanksi_id')
            ->where('sanksi_siswa.siswa_id', $siswaId)
            ->select(
                'jenis_sanksi.kode',
                'jenis_sanksi.nama',
                'sanksi_siswa.level',
                'sanksi_siswa.tanggal_mulai',
                'sanksi_siswa.tanggal_selesai',
                'sanksi_siswa.status'
            )
            ->orderByDesc('sanksi_siswa.tanggal_mulai')
            ->get();

        // ===============================
        // REKOMENDASI SANKSI (DATA-DRIVEN)
        // ===============================
        $rekomendasiSanksi = DB::table('jenis_sanksi')
            ->where('aktif', true)
            ->where('min_poin', '<=', $totalPoin)
            ->orderByDesc('level')        // prioritaskan SP tertinggi
            ->orderByDesc('min_poin')     // fallback
            ->get();

        return inertia('Kedisiplinan/Siswa/Show', [
            'siswa' => $siswa,
            'totalPoin' => $totalPoin,
            'sanksiAktif' => $sanksiAktif,
            'pelanggaran' => $pelanggaran,
            'riwayatSanksi' => $riwayatSanksi,
            'rekomendasiSanksi' => $rekomendasiSanksi,
        ]);
    }


    /* =====================================================
     * RIWAYAT SANKSI (GLOBAL)
     * ===================================================== */
  public function riwayatSanksi()
    {
        $riwayat = DB::table('sanksi_siswa')
            ->join('siswa', 'siswa.id', '=', 'sanksi_siswa.siswa_id')
            ->join('jenis_sanksi', 'jenis_sanksi.id', '=', 'sanksi_siswa.jenis_sanksi_id')
            ->select(
                'sanksi_siswa.id',
                'siswa.id as siswa_id',
                'siswa.nama as nama_siswa',
                'jenis_sanksi.kode',
                'jenis_sanksi.nama as nama_sanksi',
                'jenis_sanksi.level',
                'sanksi_siswa.level as level_snapshot',
                'sanksi_siswa.poin_saat_kena',
                'sanksi_siswa.tanggal_mulai',
                'sanksi_siswa.tanggal_selesai',
                'sanksi_siswa.status'
            )
            ->orderByDesc('sanksi_siswa.tanggal_mulai')
            ->get();

        return inertia('Kedisiplinan/RiwayatSanksi', [
            'riwayat' => $riwayat,
        ]);
    }


    /* =====================================================
     * MASTER DATA (READ ONLY)
     * ===================================================== */
    public function jenisPelanggaranIndex()
    {
        $data = DB::table('jenis_pelanggaran')
            ->select('id', 'nama', 'poin', 'aktif', 'created_at', 'updated_at')
            ->orderByDesc('aktif')
            ->orderBy('poin')
            ->orderBy('nama')
            ->get();

        return inertia('Kedisiplinan/Master/JenisPelanggaran', [
            'data' => $data,
        ]);
    }


    public function jenisSanksiIndex()
    {
        $data = DB::table('jenis_sanksi')
            ->orderBy('min_poin')
            ->get();

        return inertia('Kedisiplinan/Master/JenisSanksi', [
            'data' => $data,
        ]);
    }
}
