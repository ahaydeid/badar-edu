<?php

namespace App\Http\Controllers\KelasBinaan;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\WaliSiswa;
use App\Models\MasterDataConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DataSiswaController extends Controller
{
    public function index()
    {
        $guruId = Auth::user()->profile_id;

        // Ambil kelas binaan wali sesuai guru login
        $kelas = Kelas::where('wali_guru_id', $guruId)->first();

        $siswa = [];
        if ($kelas) {
            $siswa = Siswa::where('rombel_saat_ini', $kelas->id)
                ->orderBy('nama')
                ->get([
                    'id',
                    'nama',
                    'foto',
                    'jenis_kelamin',
                    'nipd',
                    'nis',
                    'nisn',
                ]);
        }

        return Inertia::render('Akademik/KelasBinaan/DataSiswa/Index', [
            'kelas' => $kelas ?: [
                'id'   => null,
                'nama' => '-',
            ],
            'siswa' => $siswa,
            'rombelList' => Kelas::select('id', 'nama')->orderBy('nama')->get(),
            'canEdit' => MasterDataConfig::canEdit('siswa'),
        ]);
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

        return response()->json($payload);
    }

    public function update(Request $request, $id)
    {
        // Check if editing is allowed
        if (!MasterDataConfig::canEdit('siswa')) {
            return back()->withErrors(['message' => 'Pengeditan data siswa saat ini dikunci.']);
        }

        $validated = $request->validate([
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
            'penerima_kps' => 'required|in:YA,TIDAK',
            'nomor_kps' => 'nullable|string|max:255',
            'rombel_saat_ini' => 'nullable|exists:kelas,id',
            'no_peserta_un' => 'nullable|string|max:255',
            'no_seri_ijazah' => 'nullable|string|max:255',
            'penerima_kip' => 'required|in:YA,TIDAK',
            'nomor_kip' => 'nullable|string|max:255',
            'nama_di_kip' => 'nullable|string|max:255',
            'nomor_kks' => 'nullable|string|max:255',
            'no_registrasi_akta_lahir' => 'nullable|string|max:255',
            'bank' => 'nullable|string|max:255',
            'nomor_rekening_bank' => 'nullable|string|max:255',
            'rekening_atas_nama' => 'nullable|string|max:255',
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

        DB::transaction(function () use ($request, $id, $validated) {
            $siswa = Siswa::findOrFail($id);

            if ($request->hasFile('foto')) {
                $validated['foto'] = $request->file('foto')->store('siswa', 'public');
            }

            // Normalize boolean fields
            $validated['penerima_kps'] = ($validated['penerima_kps'] ?? 'TIDAK') === 'YA';
            $validated['penerima_kip'] = ($validated['penerima_kip'] ?? 'TIDAK') === 'YA';
            $validated['layak_pip'] = ($validated['layak_pip'] ?? 'TIDAK') === 'YA';

            $waliJson = $validated['wali'] ?? null;
            unset($validated['wali']);

            $siswa->update($validated);

            // Update wali
            $siswa->wali()->delete();
            if ($waliJson) {
                $waliData = json_decode($waliJson, true);
                if (is_array($waliData)) {
                    foreach (['ayah' => 'AYAH', 'ibu' => 'IBU', 'wali' => 'WALI'] as $key => $jenis) {
                        $data = $waliData[$key] ?? null;
                        if (!$data) continue;
                        $nama = trim((string)($data['nama'] ?? ''));
                        if ($nama === '') continue;
                        WaliSiswa::create([
                            'siswa_id' => $siswa->id,
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
            }
        });

        return redirect('/kelas-binaan/data-siswa')->with('success', 'Data siswa berhasil diperbarui');
    }
}
