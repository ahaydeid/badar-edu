<?php
// app/Http/Controllers/SiswaController.php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Helpers\ImportHelper;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\WaliSiswa;
use App\Models\MasterDataConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Services\Import\DapodikNormalizer;
use Illuminate\Support\Facades\Log;


class SiswaController extends Controller
{
    public function index()
    {
        $students = Siswa::with(['wali', 'rombel'])->get()->map(function ($s) {
            $ayah = $s->wali->firstWhere('jenis_wali', 'AYAH');
            $ibu  = $s->wali->firstWhere('jenis_wali', 'IBU');
            $wali = $s->wali->firstWhere('jenis_wali', 'WALI');

            return [
                "id" => $s->id,
                "nama" => $s->nama,
                "foto" => $s->foto,

                "nipd" => $s->nipd,
                "jk" => $s->jenis_kelamin,
                "nisn" => $s->nisn,
                "tempat_lahir" => $s->tempat_lahir,
                "tanggal_lahir" => $s->tanggal_lahir,
                "nik" => $s->nik,
                "agama" => $s->agama,

                "alamat" => $s->alamat,
                "rt" => $s->rt,
                "rw" => $s->rw,
                "dusun" => $s->dusun,
                "kelurahan" => $s->kelurahan,
                "kecamatan" => $s->kecamatan,
                "kode_pos" => $s->kode_pos,

                "jenis_tinggal" => $s->jenis_tinggal,
                "alat_transportasi" => $s->alat_transportasi,
                "telepon" => $s->telepon,
                "hp" => $s->hp,
                "email" => $s->email,
                "skhun" => $s->skhun,

                "penerima_kps" => $s->penerima_kps ? "YA" : "TIDAK",
                "nomor_kps" => $s->nomor_kps,

                "rombel_id" => $s->rombel_saat_ini,
                "rombel_nama" => $s->rombel?->nama,

                "ayah_nama" => $ayah->nama ?? null,
                "ibu_nama" => $ibu->nama ?? null,

                "lintang" => $s->lintang,
                "bujur" => $s->bujur,
            ];
        });

        $rombelList = Kelas::select('id', 'nama')->orderBy('nama')->get();

        return Inertia::render("MasterData/Siswa/Index", [
            "students" => $students,
            "rombelList" => $rombelList,
            "canEdit" => MasterDataConfig::canEdit('siswa'),
        ]);
    }

    public function show($id)
    {
        $s = Siswa::with(['wali', 'rombel'])->findOrFail($id);

        $ayah = $s->wali->firstWhere('jenis_wali', 'AYAH');
        $ibu  = $s->wali->firstWhere('jenis_wali', 'IBU');
        $wali = $s->wali->firstWhere('jenis_wali', 'WALI');

        return Inertia::render('MasterData/Siswa/Show', [
            'student' => [
                'id' => $s->id,
                'nama' => $s->nama,
                'foto' => $s->foto,

                'nipd' => $s->nipd,
                'nisn' => $s->nisn,
                'jk' => $s->jenis_kelamin,
                'tempat_lahir' => $s->tempat_lahir,
                'tanggal_lahir' => $s->tanggal_lahir,
                'nik' => $s->nik,
                'agama' => $s->agama,

                'alamat' => $s->alamat,
                'rt' => $s->rt,
                'rw' => $s->rw,
                'dusun' => $s->dusun,
                'kelurahan' => $s->kelurahan,
                'kecamatan' => $s->kecamatan,
                'kode_pos' => $s->kode_pos,

                'jenis_tinggal' => $s->jenis_tinggal,
                'alat_transportasi' => $s->alat_transportasi,
                'telepon' => $s->telepon,
                'hp' => $s->hp,
                'email' => $s->email,
                'skhun' => $s->skhun,

                'penerima_kps' => $s->penerima_kps ? 'YA' : 'TIDAK',
                'nomor_kps' => $s->nomor_kps,

                'no_peserta_un' => $s->no_peserta_un,
                'no_seri_ijazah' => $s->no_seri_ijazah,

                'penerima_kip' => $s->penerima_kip ? 'YA' : 'TIDAK',
                'nomor_kip' => $s->nomor_kip,
                'nama_di_kip' => $s->nama_di_kip,
                'nomor_kks' => $s->nomor_kks,
                'no_registrasi_akta_lahir' => $s->no_registrasi_akta_lahir,

                'bank' => $s->bank,
                'nomor_rekening_bank' => $s->nomor_rekening_bank,
                'rekening_atas_nama' => $s->rekening_atas_nama,

                'layak_pip' => $s->layak_pip ? 'YA' : 'TIDAK',
                'alasan_layak_pip' => $s->alasan_layak_pip,

                'kebutuhan_khusus' => $s->kebutuhan_khusus,
                'sekolah_asal' => $s->sekolah_asal,
                'anak_ke' => $s->anak_ke,

                'lintang' => $s->lintang,
                'bujur' => $s->bujur,

                'no_kk' => $s->no_kk,

                'berat_badan' => $s->berat_badan,
                'tinggi_badan' => $s->tinggi_badan,
                'lingkar_kepala' => $s->lingkar_kepala,
                'jumlah_saudara_kandung' => $s->jumlah_saudara_kandung,
                'jarak_rumah_ke_sekolah_km' => $s->jarak_rumah_ke_sekolah_km,

                'ayah_nama' => $ayah->nama ?? null,
                'ayah_tahun_lahir' => $ayah->tahun_lahir ?? null,
                'ayah_pendidikan' => $ayah->jenjang_pendidikan ?? null,
                'ayah_pekerjaan' => $ayah->pekerjaan ?? null,
                'ayah_penghasilan' => $ayah->penghasilan ?? null,
                'ayah_nik' => $ayah->nik ?? null,

                'ibu_nama' => $ibu->nama ?? null,
                'ibu_tahun_lahir' => $ibu->tahun_lahir ?? null,
                'ibu_pendidikan' => $ibu->jenjang_pendidikan ?? null,
                'ibu_pekerjaan' => $ibu->pekerjaan ?? null,
                'ibu_penghasilan' => $ibu->penghasilan ?? null,
                'ibu_nik' => $ibu->nik ?? null,

                'wali_nama' => $wali->nama ?? null,
                'wali_tahun_lahir' => $wali->tahun_lahir ?? null,
                'wali_pendidikan' => $wali->jenjang_pendidikan ?? null,
                'wali_pekerjaan' => $wali->pekerjaan ?? null,
                'wali_penghasilan' => $wali->penghasilan ?? null,
                'wali_nik' => $wali->nik ?? null,

                'rombel_id' => $s->rombel_saat_ini,
                'rombel_nama' => $s->rombel?->nama,
            ],
        ]);
    }

    private function validateSiswa(Request $request): array
    {
        return $request->validate([
            'nama' => 'required|string|max:255',
            'nipd' => 'nullable|string|max:255',
            'nisn' => 'nullable|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'nik' => 'nullable|string|max:255',
            'agama' => 'nullable|string|max:255',

            'alamat' => 'nullable|string',
            'rt' => 'nullable|string|max:5',
            'rw' => 'nullable|string|max:5',
            'dusun' => 'nullable|string|max:255',
            'kelurahan' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:255',
            'kode_pos' => 'nullable|string|max:10',

            'jenis_tinggal' => 'nullable|string|max:255',
            'alat_transportasi' => 'nullable|string|max:255',
            'telepon' => 'nullable|string|max:255',
            'hp' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'skhun' => 'nullable|string|max:255',

            // ini untuk FORM MANUAL (bukan DB) -> nanti dinormalize jadi boolean
            'penerima_kps' => 'required|in:YA,TIDAK',
            'nomor_kps' => 'nullable|string|max:255',

            'rombel_saat_ini' => 'nullable|exists:kelas,id',

            'no_peserta_un' => 'nullable|string|max:255',
            'no_seri_ijazah' => 'nullable|string|max:255',

            // ini untuk FORM MANUAL (bukan DB) -> nanti dinormalize jadi boolean
            'penerima_kip' => 'required|in:YA,TIDAK',
            'nomor_kip' => 'nullable|string|max:255',
            'nama_di_kip' => 'nullable|string|max:255',
            'nomor_kks' => 'nullable|string|max:255',

            'no_registrasi_akta_lahir' => 'nullable|string|max:255',

            'bank' => 'nullable|string|max:255',
            'nomor_rekening_bank' => 'nullable|string|max:255',
            'rekening_atas_nama' => 'nullable|string|max:255',

            // ini untuk FORM MANUAL (bukan DB) -> nanti dinormalize jadi boolean
            'layak_pip' => 'required|in:YA,TIDAK',
            'alasan_layak_pip' => 'nullable|string',

            'kebutuhan_khusus' => 'nullable|string|max:255',
            'sekolah_asal' => 'nullable|string|max:255',
            'anak_ke' => 'nullable|integer',

            'lintang' => 'nullable|string|max:255',
            'bujur' => 'nullable|string|max:255',

            'no_kk' => 'nullable|string|max:255',

            'berat_badan' => 'nullable|integer',
            'tinggi_badan' => 'nullable|integer',
            'lingkar_kepala' => 'nullable|integer',
            'jumlah_saudara_kandung' => 'nullable|integer',
            'jarak_rumah_ke_sekolah_km' => 'nullable|numeric',

            'foto' => 'nullable|image|max:2048',
            'wali' => 'nullable|string',
        ]);
    }

    private function normalize(array &$validated): void
    {
        // FORM MANUAL: YA/TIDAK -> boolean DB
        $validated['penerima_kps'] = ($validated['penerima_kps'] ?? 'TIDAK') === 'YA';
        $validated['penerima_kip'] = ($validated['penerima_kip'] ?? 'TIDAK') === 'YA';
        $validated['layak_pip'] = ($validated['layak_pip'] ?? 'TIDAK') === 'YA';

        if (!$validated['penerima_kps']) $validated['nomor_kps'] = null;
        if (!$validated['penerima_kip']) {
            $validated['nomor_kip'] = null;
            $validated['nama_di_kip'] = null;
        }
        if (!$validated['layak_pip']) {
            $validated['alasan_layak_pip'] = null;
        }
    }

    private function saveWaliFromJson(?string $waliJson, int $siswaId): void
    {
        if (!$waliJson) return;

        $waliData = json_decode($waliJson, true);
        if (!is_array($waliData)) return;

        foreach (['ayah' => 'AYAH', 'ibu' => 'IBU', 'wali' => 'WALI'] as $key => $jenis) {
            $data = $waliData[$key] ?? null;
            if (!$data) continue;

            $nama = trim((string)($data['nama'] ?? ''));
            if ($nama === '') continue;

            WaliSiswa::create([
                'siswa_id' => $siswaId,
                'jenis_wali' => $jenis,
                'nama' => $nama,
                'tahun_lahir' => ($data['tahun_lahir'] ?? '') !== '' ? (int)$data['tahun_lahir'] : null,
                'jenjang_pendidikan' => ($data['jenjang_pendidikan'] ?? '') ?: null,
                'pekerjaan' => ($data['pekerjaan'] ?? '') ?: null,
                'penghasilan' => ($data['penghasilan'] ?? '') ?: null,
                'nik' => ($data['nik'] ?? '') ?: null,
            ]);
        }
    }

    /**
     * Generate NIS dengan format 10 digit: YYYYSSNNNN
     * - YYYY: Tahun masuk (4 digit)
     * - SS: Kode sekolah (2 digit, default 01)
     * - NNNN: Nomor urut siswa per tahun (4 digit)
     */
    private function generateNis(): string
    {
        $tahun = date('Y'); // Current year
        $kodeSekolah = '01'; // Default school code
        
        // Get last sequence number for this year
        $lastStudent = Siswa::where('nis', 'like', $tahun . $kodeSekolah . '%')
            ->orderByDesc('nis')
            ->first();
        
        if ($lastStudent && $lastStudent->nis) {
            $lastSequence = (int) substr($lastStudent->nis, 6, 4);
            $nextSequence = $lastSequence + 1;
        } else {
            $nextSequence = 1;
        }
        
        // Format: YYYYSSNNNN (10 digits total)
        return $tahun . $kodeSekolah . str_pad($nextSequence, 4, '0', STR_PAD_LEFT);
    }

    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $validated = $this->validateSiswa($request);

            if ($request->hasFile('foto')) {
                $validated['foto'] = $request->file('foto')->store('siswa', 'public');
            }

            $this->normalize($validated);

            // Auto-generate NIS if not provided
            if (empty($validated['nis'])) {
                $validated['nis'] = $this->generateNis();
            }

            $waliJson = $validated['wali'] ?? null;
            unset($validated['wali']);

            $siswa = Siswa::create($validated);

            $this->saveWaliFromJson($waliJson, $siswa->id);
        });

        return redirect('/master-data/siswa')->with('success', 'Data siswa berhasil ditambahkan');
    }

    public function edit(Request $request, $id)
    {
        $s = Siswa::with(['wali'])->findOrFail($id);

        $ayah = $s->wali->firstWhere('jenis_wali', 'AYAH');
        $ibu  = $s->wali->firstWhere('jenis_wali', 'IBU');
        $wali = $s->wali->firstWhere('jenis_wali', 'WALI');

        $payload = [
            'id' => $s->id,
            'foto' => $s->foto,

            'nama' => (string)$s->nama,
            'nipd' => (string)($s->nipd ?? ''),
            'nisn' => (string)($s->nisn ?? ''),
            'jenis_kelamin' => (string)$s->jenis_kelamin,
            'tempat_lahir' => (string)($s->tempat_lahir ?? ''),
            'tanggal_lahir' => (string)($s->tanggal_lahir ?? ''),
            'nik' => (string)($s->nik ?? ''),
            'agama' => (string)($s->agama ?? ''),

            'alamat' => (string)($s->alamat ?? ''),
            'rt' => (string)($s->rt ?? ''),
            'rw' => (string)($s->rw ?? ''),
            'dusun' => (string)($s->dusun ?? ''),
            'kelurahan' => (string)($s->kelurahan ?? ''),
            'kecamatan' => (string)($s->kecamatan ?? ''),
            'kode_pos' => (string)($s->kode_pos ?? ''),

            'jenis_tinggal' => (string)($s->jenis_tinggal ?? ''),
            'alat_transportasi' => (string)($s->alat_transportasi ?? ''),
            'telepon' => (string)($s->telepon ?? ''),
            'hp' => (string)($s->hp ?? ''),
            'email' => (string)($s->email ?? ''),
            'skhun' => (string)($s->skhun ?? ''),

            'penerima_kps' => $s->penerima_kps ? 'YA' : 'TIDAK',
            'nomor_kps' => (string)($s->nomor_kps ?? ''),

            'rombel_saat_ini' => (string)($s->rombel_saat_ini ?? ''),

            'no_peserta_un' => (string)($s->no_peserta_un ?? ''),
            'no_seri_ijazah' => (string)($s->no_seri_ijazah ?? ''),

            'penerima_kip' => $s->penerima_kip ? 'YA' : 'TIDAK',
            'nomor_kip' => (string)($s->nomor_kip ?? ''),
            'nama_di_kip' => (string)($s->nama_di_kip ?? ''),
            'nomor_kks' => (string)($s->nomor_kks ?? ''),

            'no_registrasi_akta_lahir' => (string)($s->no_registrasi_akta_lahir ?? ''),

            'bank' => (string)($s->bank ?? ''),
            'nomor_rekening_bank' => (string)($s->nomor_rekening_bank ?? ''),
            'rekening_atas_nama' => (string)($s->rekening_atas_nama ?? ''),

            'layak_pip' => $s->layak_pip ? 'YA' : 'TIDAK',
            'alasan_layak_pip' => (string)($s->alasan_layak_pip ?? ''),

            'kebutuhan_khusus' => (string)($s->kebutuhan_khusus ?? ''),
            'sekolah_asal' => (string)($s->sekolah_asal ?? ''),
            'anak_ke' => (string)($s->anak_ke ?? ''),

            'lintang' => (string)($s->lintang ?? ''),
            'bujur' => (string)($s->bujur ?? ''),

            'no_kk' => (string)($s->no_kk ?? ''),

            'berat_badan' => (string)($s->berat_badan ?? ''),
            'tinggi_badan' => (string)($s->tinggi_badan ?? ''),
            'lingkar_kepala' => (string)($s->lingkar_kepala ?? ''),
            'jumlah_saudara_kandung' => (string)($s->jumlah_saudara_kandung ?? ''),
            'jarak_rumah_ke_sekolah_km' => (string)($s->jarak_rumah_ke_sekolah_km ?? ''),

            'wali' => [
                'ayah' => [
                    'nama' => (string)($ayah->nama ?? ''),
                    'tahun_lahir' => (string)($ayah->tahun_lahir ?? ''),
                    'jenjang_pendidikan' => (string)($ayah->jenjang_pendidikan ?? ''),
                    'pekerjaan' => (string)($ayah->pekerjaan ?? ''),
                    'penghasilan' => (string)($ayah->penghasilan ?? ''),
                    'nik' => (string)($ayah->nik ?? ''),
                ],
                'ibu' => [
                    'nama' => (string)($ibu->nama ?? ''),
                    'tahun_lahir' => (string)($ibu->tahun_lahir ?? ''),
                    'jenjang_pendidikan' => (string)($ibu->jenjang_pendidikan ?? ''),
                    'pekerjaan' => (string)($ibu->pekerjaan ?? ''),
                    'penghasilan' => (string)($ibu->penghasilan ?? ''),
                    'nik' => (string)($ibu->nik ?? ''),
                ],
                'wali' => [
                    'nama' => (string)($wali->nama ?? ''),
                    'tahun_lahir' => (string)($wali->tahun_lahir ?? ''),
                    'jenjang_pendidikan' => (string)($wali->jenjang_pendidikan ?? ''),
                    'pekerjaan' => (string)($wali->pekerjaan ?? ''),
                    'penghasilan' => (string)($wali->penghasilan ?? ''),
                    'nik' => (string)($wali->nik ?? ''),
                ],
            ],
        ];

        if ($request->wantsJson()) {
            return response()->json($payload);
        }

        $rombelList = Kelas::select('id', 'nama')->orderBy('nama')->get();

        return Inertia::render('MasterData/Siswa/Edit', [
            'student' => $payload,
            'rombelList' => $rombelList,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Check if editing is allowed
        if (!MasterDataConfig::canEdit('siswa')) {
            return back()->withErrors(['message' => 'Pengeditan data siswa saat ini dikunci. Hubungi administrator untuk membuka akses.']);
        }

        DB::transaction(function () use ($request, $id) {
            $siswa = Siswa::findOrFail($id);
            $validated = $this->validateSiswa($request);

            if ($request->hasFile('foto')) {
                $validated['foto'] = $request->file('foto')->store('siswa', 'public');
            }

            $this->normalize($validated);

            $waliJson = $validated['wali'] ?? null;
            unset($validated['wali']);

            $siswa->update($validated);

            $siswa->wali()->delete();
            $this->saveWaliFromJson($waliJson, $siswa->id);
        });

        return redirect('/master-data/siswa')->with('success', 'Data siswa berhasil diperbarui');
    }

   public function destroy($id)
{
    DB::transaction(function () use ($id) {
        $siswa = Siswa::findOrFail($id);
        $siswa->wali()->delete();
        $siswa->delete();
    });

    return redirect('/master-data/siswa')
        ->with('success', 'Data siswa berhasil dihapus')
        ->setStatusCode(303);
}


    /* ============================================================
     * IMPORT (FIXED)
     * - support 2 format key: Excel ("Nama") & FE payload ("nama")
     * - rombel: nama -> id (kelas.id)
     * - boolean tinyint: YA/TIDAK -> 1/0
     * - wali: dari kolom Excel ATAU dari payload 'wali' json
     * ============================================================ */

    private function pick(array $r, string $excelKey, ?string $payloadKey = null)
    {
        if (array_key_exists($excelKey, $r)) return $r[$excelKey];
        if ($payloadKey && array_key_exists($payloadKey, $r)) return $r[$payloadKey];
        return null;
    }

    private function resolveRombelId($rombelValue): ?int
    {
        $v = trim((string)($rombelValue ?? ''));
        if ($v === '') return null;

        // kalau numeric, anggap itu id
        if (ctype_digit($v)) return (int)$v;

        // kalau teks, cari by nama (case-insensitive)
        $id = Kelas::whereRaw('LOWER(nama) = ?', [mb_strtolower($v)])->value('id');
        return $id ? (int)$id : null;
    }

    private function saveWaliFromImportRow(int $siswaId, array $r): void
    {
        // 1) kalau ada payload 'wali' (json string) => pakai yg sudah ada
        $waliJson = $this->pick($r, 'wali', 'wali');
        if (is_string($waliJson) && trim($waliJson) !== '') {
            $this->saveWaliFromJson($waliJson, $siswaId);
            return;
        }

        // 2) kalau FE kirim wali sebagai array/object (bukan json) -> encode dulu
        if (is_array($waliJson)) {
            $this->saveWaliFromJson(json_encode($waliJson), $siswaId);
            return;
        }

        // 3) kalau tidak ada, coba dari kolom Excel (Nama Ayah/Ibu/Wali dst)
        $map = [
            'AYAH' => [
                'nama' => 'Nama Ayah',
                'tahun' => 'Tahun Lahir Ayah',
                'pendidikan' => 'Jenjang Pendidikan Ayah',
                'pekerjaan' => 'Pekerjaan Ayah',
                'penghasilan' => 'Penghasilan Ayah',
                'nik' => 'NIK Ayah',
            ],
            'IBU' => [
                'nama' => 'Nama Ibu',
                'tahun' => 'Tahun Lahir Ibu',
                'pendidikan' => 'Jenjang Pendidikan Ibu',
                'pekerjaan' => 'Pekerjaan Ibu',
                'penghasilan' => 'Penghasilan Ibu',
                'nik' => 'NIK Ibu',
            ],
            'WALI' => [
                'nama' => 'Nama Wali',
                'tahun' => 'Tahun Lahir Wali',
                'pendidikan' => 'Jenjang Pendidikan Wali',
                'pekerjaan' => 'Pekerjaan Wali',
                'penghasilan' => 'Penghasilan Wali',
                'nik' => 'NIK Wali',
            ],
        ];

        foreach ($map as $jenis => $cols) {
            $nama = trim((string)($this->pick($r, $cols['nama']) ?? ''));
            if ($nama === '') continue;

            $tahun = trim((string)($this->pick($r, $cols['tahun']) ?? ''));
            $tahunInt = ctype_digit($tahun) ? (int)$tahun : null;

            WaliSiswa::create([
                'siswa_id' => $siswaId,
                'jenis_wali' => $jenis,
                'nama' => $nama,
                'tahun_lahir' => $tahunInt,
                'jenjang_pendidikan' => ImportHelper::text($this->pick($r, $cols['pendidikan'])),
                'pekerjaan' => ImportHelper::text($this->pick($r, $cols['pekerjaan'])),
                'penghasilan' => ImportHelper::text($this->pick($r, $cols['penghasilan'])),
                'nik' => ImportHelper::text($this->pick($r, $cols['nik'])),
            ]);
        }
    }

    public function import(Request $request)
    {
        $rows = $request->input('rows', []);

        $errors = [];

        DB::beginTransaction();

        try {
            foreach ($rows as $i => $r) {
                try {
                    // =============================
                    // KODE LAMA KAMU (TIDAK DIUBAH)
                    // =============================

                    $nama = $this->pick($r, 'Nama', 'nama');
                    if (trim((string)$nama) === '') continue;

                    $rombelRaw = $this->pick($r, 'Rombel Saat Ini', 'rombel_saat_ini');
                    $rombelNormalized = DapodikNormalizer::normalizeRombel($rombelRaw);
                    $rombelId = $this->resolveRombelId($rombelNormalized);

                    $penerimaKps = DapodikNormalizer::normalizeYesNo(
                        $this->pick($r, 'Penerima KPS', 'penerima_kps')
                    );
                    $penerimaKip = ImportHelper::yesNo($this->pick($r, 'Penerima KIP', 'penerima_kip'));
                    $layakPip    = ImportHelper::yesNo($this->pick($r, 'Layak PIP (usulan dari sekolah)', 'layak_pip'));

                    $nomorKps  = ImportHelper::text($this->pick($r, 'No. KPS', 'nomor_kps'));
                    $nomorKip  = ImportHelper::text($this->pick($r, 'Nomor KIP', 'nomor_kip'));
                    $namaDiKip = ImportHelper::text($this->pick($r, 'Nama di KIP', 'nama_di_kip'));
                    $alasanPip = ImportHelper::text($this->pick($r, 'Alasan Layak PIP', 'alasan_layak_pip'));

                    if (!$penerimaKps) $nomorKps = null;
                    if (!$penerimaKip) { $nomorKip = null; $namaDiKip = null; }
                    if (!$layakPip) $alasanPip = null;

                    // CEK DUPLIKASI (Simple Check: NIK atau NIPD atau NISN)
                    // Jika data sudah ada, kita SKIP atau UPDATE.
                    // Di sini kita pakai pendekatan: JIKA ADA NIK/NISN YANG SAMA, UPDATE DATANYA.
                    // JIKA TIDAK ADA, CREATE BARU.

                    $nik = ImportHelper::text($this->pick($r, 'NIK', 'nik'));
                    $nisn = ImportHelper::text($this->pick($r, 'NISN', 'nisn'));
                    $nipd = ImportHelper::text($this->pick($r, 'NIPD', 'nipd'));

                    $existingSiswa = null;

                    if ($nik) {
                        $existingSiswa = Siswa::where('nik', $nik)->first();
                    }
                    if (!$existingSiswa && $nisn) {
                        $existingSiswa = Siswa::where('nisn', $nisn)->first();
                    }
                     if (!$existingSiswa && $nipd) {
                        $existingSiswa = Siswa::where('nipd', $nipd)->first();
                    }

                    if ($existingSiswa) {
                        // UPDATE DATA YANG ADA
                         $existingSiswa->update([
                            'nama' => ImportHelper::text($nama), // Tetap update nama
                            'nipd' => $nipd ?: $existingSiswa->nipd,
                            'nisn' => $nisn ?: $existingSiswa->nisn,
                            'jenis_kelamin' =>
                                strtoupper((string)($this->pick($r, 'JK', 'jenis_kelamin') ?? 'L')) === 'P' ? 'P' : 'L',
                            'rombel_saat_ini' => $rombelId ?: $existingSiswa->rombel_saat_ini, // Update rombel jika ada
                             // ... (field lain bisa diupdate sesuai kebutuhan, untuk sekarang yang krusial saja)
                         ]);
                         $siswa = $existingSiswa;
                    } else {
                        // CREATE BARU
                        $siswa = Siswa::create([
                        'nama' => ImportHelper::text($nama),
                        'nipd' => ImportHelper::text($this->pick($r, 'NIPD', 'nipd')),
                        'nisn' => ImportHelper::text($this->pick($r, 'NISN', 'nisn')),
                        'jenis_kelamin' =>
                            strtoupper((string)($this->pick($r, 'JK', 'jenis_kelamin') ?? 'L')) === 'P' ? 'P' : 'L',

                        'tempat_lahir' => ImportHelper::text($this->pick($r, 'Tempat Lahir', 'tempat_lahir')),
                        'tanggal_lahir' => ImportHelper::date($this->pick($r, 'Tanggal Lahir', 'tanggal_lahir')),
                        'nik' => ImportHelper::text($this->pick($r, 'NIK', 'nik')),
                        'agama' => ImportHelper::text($this->pick($r, 'Agama', 'agama')),

                        'alamat' => ImportHelper::text($this->pick($r, 'Alamat', 'alamat')),
                        'rt' => ImportHelper::text($this->pick($r, 'RT', 'rt')),
                        'rw' => ImportHelper::text($this->pick($r, 'RW', 'rw')),
                        'dusun' => ImportHelper::text($this->pick($r, 'Dusun', 'dusun')),
                        'kelurahan' => ImportHelper::text($this->pick($r, 'Kelurahan', 'kelurahan')),
                        'kecamatan' => ImportHelper::text($this->pick($r, 'Kecamatan', 'kecamatan')),
                        'kode_pos' => ImportHelper::text($this->pick($r, 'Kode Pos', 'kode_pos')),

                        'jenis_tinggal' => ImportHelper::text($this->pick($r, 'Jenis Tinggal', 'jenis_tinggal')),
                        'alat_transportasi' => ImportHelper::text($this->pick($r, 'Alat Transportasi', 'alat_transportasi')),
                        'telepon' => ImportHelper::text($this->pick($r, 'Telepon', 'telepon')),
                        'hp' => ImportHelper::text($this->pick($r, 'HP', 'hp')),
                        'email' => ImportHelper::text($this->pick($r, 'E-Mail', 'email')),
                        'skhun' => ImportHelper::text($this->pick($r, 'SKHUN', 'skhun')),

                        'penerima_kps' => $penerimaKps,
                        'nomor_kps' => $nomorKps,

                        'rombel_saat_ini' => $rombelId,

                        'no_peserta_un' => ImportHelper::text($this->pick($r, 'No Peserta Ujian Nasional', 'no_peserta_un')),
                        'no_seri_ijazah' => ImportHelper::text($this->pick($r, 'No Seri Ijazah', 'no_seri_ijazah')),

                        'penerima_kip' => $penerimaKip,
                        'nomor_kip' => $nomorKip,
                        'nama_di_kip' => $namaDiKip,
                        'nomor_kks' => ImportHelper::text($this->pick($r, 'Nomor KKS', 'nomor_kks')),

                        'no_registrasi_akta_lahir' =>
                            ImportHelper::text($this->pick($r, 'No Registrasi Akta Lahir', 'no_registrasi_akta_lahir')),

                        'bank' => ImportHelper::text($this->pick($r, 'Bank', 'bank')),
                        'nomor_rekening_bank' =>
                            ImportHelper::text($this->pick($r, 'Nomor Rekening Bank', 'nomor_rekening_bank')),
                        'rekening_atas_nama' =>
                            ImportHelper::text($this->pick($r, 'Rekening Atas Nama', 'rekening_atas_nama')),

                        'layak_pip' => $layakPip,
                        'alasan_layak_pip' => $alasanPip,

                        'kebutuhan_khusus' =>
                            ImportHelper::text($this->pick($r, 'Kebutuhan Khusus', 'kebutuhan_khusus')),
                        'sekolah_asal' =>
                            ImportHelper::text($this->pick($r, 'Sekolah Asal', 'sekolah_asal')),

                        'anak_ke' => DapodikNormalizer::normalizeAnakKe(
                            $this->pick($r, 'Anak ke-berapa', 'anak_ke')
                        ),

                        'lintang' => ImportHelper::text($this->pick($r, 'Lintang', 'lintang')),
                        'bujur' => ImportHelper::text($this->pick($r, 'Bujur', 'bujur')),
                        'no_kk' => ImportHelper::text($this->pick($r, 'No KK', 'no_kk')),

                        'berat_badan' => ImportHelper::number($this->pick($r, 'Berat Badan', 'berat_badan')),
                        'tinggi_badan' => ImportHelper::number($this->pick($r, 'Tinggi Badan', 'tinggi_badan')),
                        'lingkar_kepala' => ImportHelper::number($this->pick($r, 'Lingkar Kepala', 'lingkar_kepala')),
                        'jumlah_saudara_kandung' =>
                            ImportHelper::number($this->pick($r, 'Jml. Saudara Kandung', 'jumlah_saudara_kandung')),
                        'jarak_rumah_ke_sekolah_km' =>
                            ImportHelper::number($this->pick($r, 'Jarak Rumah ke Sekolah (KM)', 'jarak_rumah_ke_sekolah_km')),
                    ]);

                    $this->saveWaliFromImportRow($siswa->id, $r);
                    }
                } catch (\Throwable $e) {
                    $errors[] = [
                        'nama'   => ImportHelper::text($nama) ?: '(Tanpa Nama)',
                        'reason' => $this->humanizeImportError($e),
                    ];


                    Log::error('Import siswa gagal', [
                        'row' => $i + 2,
                        'error' => $e->getMessage(),
                        'data' => $r,
                    ]);
                }
            }

            DB::commit();

            if (!empty($errors)) {
                return back()->with([
                    'import_failed' => true,
                    'import_errors' => $errors,
                ]);
            }

            return back()->with('success', 'Import data siswa berhasil');

        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->with([
                'import_failed' => true,
                'import_errors' => [[
                    'nama' => $nama ?? '(Tidak diketahui)',
                    'reason' => $e->getMessage(),
                ]],
            ]);
        }

    }

    private function humanizeImportError(\Throwable $e): string
{
    $msg = strtolower($e->getMessage());

    if (str_contains($msg, 'anak_ke')) {
        return 'Anak ke-berapa harus berupa angka yang wajar';
    }

    if (str_contains($msg, 'rombel')) {
        return 'Rombel tidak ditemukan';
    }

    if (str_contains($msg, 'date') || str_contains($msg, 'tanggal')) {
        return 'Format tanggal tidak valid';
    }

    if (str_contains($msg, 'numeric') || str_contains($msg, 'out of range')) {
        return 'Data angka tidak valid / terlalu besar';
    }

    return 'Data tidak valid';
}


}
