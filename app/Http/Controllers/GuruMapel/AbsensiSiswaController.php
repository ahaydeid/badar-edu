<?php

namespace App\Http\Controllers\GuruMapel;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Kelas;
use App\Models\Jadwal;
use App\Models\Semester;
use App\Models\Siswa;

class AbsensiSiswaController extends Controller
{
    private function getGuru()
    {
        $user = auth()->user();
        if (!$user || $user->profile_type !== 'App\Models\Guru') {
             abort(403, 'Akses khusus Guru');
        }
        return $user->profile;
    }

    private function getActiveSemester()
    {
        $now = now();
        return Semester::where('tanggal_mulai', '<=', $now)
            ->where('tanggal_selesai', '>=', $now)
            ->first() 
            ?? Semester::latest()->firstOrFail();
    }

    public function index()
    {
        $guru = $this->getGuru();
        $semester = $this->getActiveSemester();

        $kelasList = Kelas::join('jadwal','jadwal.kelas_id','=','kelas.id')
            ->leftJoin('guru','guru.id','=','kelas.wali_guru_id')
            ->where('jadwal.guru_id', $guru->id)
            ->where('jadwal.semester_id', $semester->id)
            ->where('jadwal.is_active', true)
            ->select('kelas.id','kelas.nama as nama_rombel','guru.nama as wali_nama')
            ->groupBy('kelas.id','kelas.nama','guru.nama')
            ->orderBy('kelas.nama')
            ->get()
            ->map(fn($k)=>[
                'id'=>$k->id,
                'nama_rombel'=>$k->nama_rombel,
                'wali_nama'=>$k->wali_nama,
                'jumlah_siswa'=>$k->siswa()->count()
            ]);

        return Inertia::render('Akademik/AbsensiMapel/Index',['kelasList'=>$kelasList]);
    }

    public function kelas($kelasId)
    {
        $guru = $this->getGuru();
        $semester = $this->getActiveSemester();

        $jadwal = Jadwal::with(['kelas:id,nama','mapel:id,nama'])
            ->where('guru_id', $guru->id)
            ->where('kelas_id', $kelasId)
            ->where('semester_id', $semester->id)
            ->where('is_active', true)
            ->firstOrFail();

        $siswaList = Siswa::where('rombel_saat_ini',$kelasId)->orderBy('nama')->get();
        $ids = $siswaList->pluck('id');

        $rekap = DB::table('absen_jp_detail')
            ->join('jenis_absen','jenis_absen.id','=','absen_jp_detail.jenis_absen_id')
            ->whereIn('absen_jp_detail.siswa_id',$ids)
            ->select('absen_jp_detail.siswa_id','jenis_absen.kode',DB::raw('SUM(absen_jp_detail.jumlah) total'))
            ->groupBy('absen_jp_detail.siswa_id','jenis_absen.kode')
            ->get()
            ->groupBy('siswa_id');

        $siswa = $siswaList->values()->map(function ($s) use ($rekap) {
            $rows = $rekap->get($s->id, collect());
            $sum = fn($k)=>(int)$rows->where('kode',$k)->sum('total');

            return [
                'id'=>$s->id,
                'nama'=>$s->nama,
                'foto'=>$s->foto,
                'hadir'=>$sum('HADIR'),
                'terlambat'=>$sum('TERLAMBAT'),
                'sakit'=>$sum('SAKIT'),
                'izin'=>$sum('IZIN'),
                'alfa'=>$sum('ALFA'),
            ];
        });

        return Inertia::render('Akademik/AbsensiMapel/components/Kelas',[
            'kelas'=>$jadwal->kelas,
            'mapel'=>$jadwal->mapel,
            'jadwalId'=>$jadwal->id,
            'siswa'=>$siswa
        ]);
    }

    public function detail($jadwalId, $siswaId)
    {
        $rows = DB::table('absen_jp')
            ->where('siswa_id', $siswaId)
            ->orderBy('tanggal')
            ->get()
            ->map(fn ($r) => [
                'tanggal'   => $r->tanggal,
                'hadir'     => 1,
                'terlambat' => '-',
                'sakit'     => '-',
                'izin'      => '-',
                'alfa'      => '-',
            ]);

        return response()->json($rows);
    }


}
