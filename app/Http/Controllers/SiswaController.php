<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\WaliSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SiswaController extends Controller
{
    /* =========================================================
     | INDEX
     ========================================================= */
    public function index()
    {
        $students = Siswa::with(['wali', 'rombel'])->get()->map(function ($s) {
            $ayah = $s->wali->firstWhere('jenis_wali', 'AYAH');
            $ibu  = $s->wali->firstWhere('jenis_wali', 'IBU');
            $wali = $s->wali->firstWhere('jenis_wali', 'WALI');

            return [
                'id' => $s->id,
                'nama' => $s->nama,
                'foto' => $s->foto,
                'nipd' => $s->nipd,
                'nisn' => $s->nisn,
                'jk' => $s->jenis_kelamin,
                'tanggal_lahir' => $s->tanggal_lahir,
                'hp' => $s->hp,
                'alamat' => $s->alamat,
                'rt' => $s->rt,
                'rw' => $s->rw,
                'kelurahan' => $s->kelurahan,
                'kecamatan' => $s->kecamatan,
                'rombel_nama' => $s->rombel?->nama,

                'ayah_nama' => $ayah->nama ?? null,
                'ibu_nama' => $ibu->nama ?? null,
            ];
        });

        $rombelList = Kelas::select('id','nama')->orderBy('nama')->get();

        return Inertia::render('Master-Data/Siswa/Index', [
            'students' => $students,
            'rombelList' => $rombelList,
        ]);
    }

    /* =========================================================
     | SHOW
     ========================================================= */
    public function show($id)
    {
        $s = Siswa::with(['wali','rombel'])->findOrFail($id);
        return Inertia::render('Master-Data/Siswa/Show', [
            'student' => $this->payload($s),
        ]);
    }

    /* =========================================================
     | STORE
     ========================================================= */
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $data = $this->validateSiswa($request);

            if ($request->hasFile('foto')) {
                $data['foto'] = $request->file('foto')->store('siswa', 'public');
            }

            $data['penerima_kps'] = $data['penerima_kps'] === 'YA';
            $data['penerima_kip'] = $data['penerima_kip'] === 'YA';
            $data['layak_pip']    = $data['layak_pip'] === 'YA';

            $siswa = Siswa::create($data);
            $this->saveWali($request, $siswa);
        });

        return redirect('/master-data/siswa');
    }

    /* =========================================================
     | EDIT
     ========================================================= */
    public function edit($id)
    {
        $s = Siswa::with(['wali'])->findOrFail($id);
        $rombelList = Kelas::select('id','nama')->orderBy('nama')->get();

        return Inertia::render('Master-Data/Siswa/Edit', [
            'student' => $this->payload($s),
            'rombelList' => $rombelList,
        ]);
    }

    /* =========================================================
     | UPDATE
     ========================================================= */
    public function update(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $siswa = Siswa::findOrFail($id);
            $data = $this->validateSiswa($request);

            if ($request->hasFile('foto')) {
                $data['foto'] = $request->file('foto')->store('siswa', 'public');
            }

            $data['penerima_kps'] = $data['penerima_kps'] === 'YA';
            $data['penerima_kip'] = $data['penerima_kip'] === 'YA';
            $data['layak_pip']    = $data['layak_pip'] === 'YA';

            $siswa->update($data);

            $siswa->wali()->delete();
            $this->saveWali($request, $siswa);
        });

        return redirect('/master-data/siswa');
    }

    /* =========================================================
     | DESTROY
     ========================================================= */
    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $s = Siswa::findOrFail($id);
            $s->wali()->delete();
            $s->delete();
        });

        return redirect('/master-data/siswa');
    }

    /* =========================================================
     | VALIDATION (FULL DATABASE)
     ========================================================= */
    private function validateSiswa(Request $r): array
    {
        return $r->validate([
            'nama' => 'required|string',
            'foto' => 'nullable|image',
            'nipd' => 'nullable|string',
            'nisn' => 'nullable|string',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'nik' => 'nullable|string',
            'agama' => 'nullable|string',

            'alamat' => 'nullable|string',
            'rt' => 'nullable|string',
            'rw' => 'nullable|string',
            'dusun' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'kode_pos' => 'nullable|string',

            'jenis_tinggal' => 'nullable|string',
            'alat_transportasi' => 'nullable|string',
            'telepon' => 'nullable|string',
            'hp' => 'nullable|string',
            'email' => 'nullable|email',
            'skhun' => 'nullable|string',

            'rombel_saat_ini' => 'nullable|exists:kelas,id',

            'no_peserta_un' => 'nullable|string',
            'no_seri_ijazah' => 'nullable|string',
            'sekolah_asal' => 'nullable|string',

            'penerima_kps' => 'required|in:YA,TIDAK',
            'nomor_kps' => 'nullable|string',

            'penerima_kip' => 'required|in:YA,TIDAK',
            'nomor_kip' => 'nullable|string',
            'nama_di_kip' => 'nullable|string',
            'nomor_kks' => 'nullable|string',

            'bank' => 'nullable|string',
            'nomor_rekening_bank' => 'nullable|string',
            'rekening_atas_nama' => 'nullable|string',

            'layak_pip' => 'required|in:YA,TIDAK',
            'alasan_layak_pip' => 'nullable|string',

            'kebutuhan_khusus' => 'nullable|string',
            'anak_ke' => 'nullable|integer',
            'berat_badan' => 'nullable|integer',
            'tinggi_badan' => 'nullable|integer',
            'lingkar_kepala' => 'nullable|integer',
            'jumlah_saudara_kandung' => 'nullable|integer',

            'lintang' => 'nullable|string',
            'bujur' => 'nullable|string',
            'jarak_rumah_ke_sekolah_km' => 'nullable|numeric',

            'wali' => 'nullable|string',
        ]);
    }

    /* =========================================================
     | PAYLOAD EDIT / SHOW
     ========================================================= */
    private function payload(Siswa $s): array
    {
        $wali = fn($j) => $s->wali->firstWhere('jenis_wali', $j);

        return array_merge($s->toArray(), [
            'wali' => [
                'ayah' => $wali('AYAH'),
                'ibu'  => $wali('IBU'),
                'wali' => $wali('WALI'),
            ],
        ]);
    }

    /* =========================================================
     | SAVE WALI
     ========================================================= */
    private function saveWali(Request $r, Siswa $siswa): void
    {
        if (!$r->filled('wali')) return;

        $waliData = json_decode($r->wali, true);

        foreach (['ayah'=>'AYAH','ibu'=>'IBU','wali'=>'WALI'] as $k => $jenis) {
            $d = $waliData[$k] ?? null;
            if ($d && trim($d['nama'] ?? '') !== '') {
                WaliSiswa::create([
                    'siswa_id' => $siswa->id,
                    'jenis_wali' => $jenis,
                    'nama' => $d['nama'],
                    'tahun_lahir' => $d['tahun_lahir'] ?: null,
                    'jenjang_pendidikan' => $d['jenjang_pendidikan'] ?: null,
                    'pekerjaan' => $d['pekerjaan'] ?: null,
                    'penghasilan' => $d['penghasilan'] ?: null,
                    'nik' => $d['nik'] ?: null,
                ]);
            }
        }
    }
}
