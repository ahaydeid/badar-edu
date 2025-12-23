<?php

namespace App\Http\Controllers\KelasBinaan;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use Inertia\Inertia;

class DataSiswaController extends Controller
{
    public function index()
    {
        // ASUMSI LOGIN SEMENTARA
        $guruId = 17;

        // Ambil kelas binaan wali
        $kelas = Kelas::where('wali_guru_id', $guruId)->firstOrFail();

        $siswa = Siswa::where('rombel_saat_ini', $kelas->id)
            ->orderBy('nama')
            ->get([
                'id',
                'nama',
                'jenis_kelamin',
                'nipd',
                'nisn',
            ]);

        return Inertia::render('Akademik/KelasBinaan/DataSiswa/Index', [
            'kelas' => [
                'id'   => $kelas->id,
                'nama' => $kelas->nama,
            ],
            'siswa' => $siswa,
        ]);
    }
}
