<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index()
    {
        $students = Siswa::with('wali')->get()->map(function ($s) {

            $ayah = $s->wali->firstWhere('jenis_wali', 'AYAH');
            $ibu  = $s->wali->firstWhere('jenis_wali', 'IBU');
            $wali = $s->wali->firstWhere('jenis_wali', 'WALI');

            return [
                "id" => $s->id,
                "nama" => $s->nama,
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

                // AYAH
                "ayah_nama" => $ayah->nama ?? null,
                "ayah_tahun_lahir" => $ayah->tahun_lahir ?? null,
                "ayah_pendidikan" => $ayah->jenjang_pendidikan ?? null,
                "ayah_pekerjaan" => $ayah->pekerjaan ?? null,
                "ayah_penghasilan" => $ayah->penghasilan ?? null,
                "ayah_nik" => $ayah->nik ?? null,

                // IBU
                "ibu_nama" => $ibu->nama ?? null,
                "ibu_tahun_lahir" => $ibu->tahun_lahir ?? null,
                "ibu_pendidikan" => $ibu->jenjang_pendidikan ?? null,
                "ibu_pekerjaan" => $ibu->pekerjaan ?? null,
                "ibu_penghasilan" => $ibu->penghasilan ?? null,
                "ibu_nik" => $ibu->nik ?? null,

                // WALI
                "wali_nama" => $wali->nama ?? null,
                "wali_tahun_lahir" => $wali->tahun_lahir ?? null,
                "wali_pendidikan" => $wali->jenjang_pendidikan ?? null,
                "wali_pekerjaan" => $wali->pekerjaan ?? null,
                "wali_penghasilan" => $wali->penghasilan ?? null,
                "wali_nik" => $wali->nik ?? null,

                "rombel_saat_ini" => $s->rombel_saat_ini,
                "no_peserta_un" => $s->no_peserta_un,
                "no_seri_ijazah" => $s->no_seri_ijazah,
                "penerima_kip" => $s->penerima_kip ? "YA" : "TIDAK",
                "nomor_kip" => $s->nomor_kip,
                "nama_di_kip" => $s->nama_di_kip,
                "nomor_kks" => $s->nomor_kks,
                "no_reg_akta" => $s->no_registrasi_akta_lahir,

                "layak_pip" => $s->layak_pip ? "YA" : "TIDAK",
                "alasan_layak_pip" => $s->alasan_layak_pip,

                "kebutuhan_khusus" => $s->kebutuhan_khusus,
                "sekolah_asal" => $s->sekolah_asal,
                "anak_ke" => $s->anak_ke,
                "lintang" => $s->lintang,
                "bujur" => $s->bujur,
                "no_kk" => $s->no_kk,
                "berat_badan" => $s->berat_badan,
                "tinggi_badan" => $s->tinggi_badan,
                "lingkar_kepala" => $s->lingkar_kepala,
                "jumlah_saudara" => $s->jumlah_saudara_kandung,
                "jarak_rumah" => $s->jarak_rumah_ke_sekolah_km,
            ];
        });

        return Inertia::render("Master-Data/Siswa/Index", [
            "students" => $students
        ]);
    }

    public function show($id)
    {
        $s = Siswa::with('wali')->findOrFail($id);

        $ayah = $s->wali->firstWhere('jenis_wali', 'AYAH');
        $ibu  = $s->wali->firstWhere('jenis_wali', 'IBU');
        $wali = $s->wali->firstWhere('jenis_wali', 'WALI');

        return Inertia::render("Master-Data/Siswa/Show", [
            "student" => [
                "id" => $s->id,
                "nama" => $s->nama,
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
                "anak_ke" => $s->anak_ke,

                // AYAH
                "ayah_nama" => $ayah->nama ?? null,
                "ayah_tahun_lahir" => $ayah->tahun_lahir ?? null,
                "ayah_pendidikan" => $ayah->jenjang_pendidikan ?? null,
                "ayah_pekerjaan" => $ayah->pekerjaan ?? null,
                "ayah_penghasilan" => $ayah->penghasilan ?? null,
                "ayah_nik" => $ayah->nik ?? null,

                // IBU
                "ibu_nama" => $ibu->nama ?? null,
                "ibu_tahun_lahir" => $ibu->tahun_lahir ?? null,
                "ibu_pendidikan" => $ibu->jenjang_pendidikan ?? null,
                "ibu_pekerjaan" => $ibu->pekerjaan ?? null,
                "ibu_penghasilan" => $ibu->penghasilan ?? null,
                "ibu_nik" => $ibu->nik ?? null,

                // WALI
                "wali_nama" => $wali->nama ?? null,
                "wali_tahun_lahir" => $wali->tahun_lahir ?? null,
                "wali_pendidikan" => $wali->jenjang_pendidikan ?? null,
                "wali_pekerjaan" => $wali->pekerjaan ?? null,
                "wali_penghasilan" => $wali->penghasilan ?? null,
                "wali_nik" => $wali->nik ?? null,

                "rombel_saat_ini" => $s->rombel_saat_ini,
                "no_peserta_un" => $s->no_peserta_un,
                "no_seri_ijazah" => $s->no_seri_ijazah,
                "penerima_kip" => $s->penerima_kip ? "YA" : "TIDAK",
                "nomor_kip" => $s->nomor_kip,
                "nama_di_kip" => $s->nama_di_kip,
                "nomor_kks" => $s->nomor_kks,
                "no_reg_akta" => $s->no_registrasi_akta_lahir,
                "layak_pip" => $s->layak_pip ? "YA" : "TIDAK",

                "kebutuhan_khusus" => $s->kebutuhan_khusus,
                "sekolah_asal" => $s->sekolah_asal,
                "lintang" => $s->lintang,
                "bujur" => $s->bujur,
                "no_kk" => $s->no_kk,
                "berat_badan" => $s->berat_badan,
                "tinggi_badan" => $s->tinggi_badan,
                "lingkar_kepala" => $s->lingkar_kepala,
                "jumlah_saudara" => $s->jumlah_saudara_kandung,
                "jarak_rumah" => $s->jarak_rumah_ke_sekolah_km,
                "bank" => $s->bank,
                "bank_rekening" => $s->nomor_rekening_bank,
                "bank_atas_nama" => $s->rekening_atas_nama,
            ]
        ]);
    }
}
