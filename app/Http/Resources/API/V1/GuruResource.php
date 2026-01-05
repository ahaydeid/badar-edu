<?php

namespace App\Http\Resources\API\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuruResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kode_guru' => $this->kode_guru,
            'nama' => $this->nama,
            'foto' => $this->foto,
            'jk' => $this->jk,
            'tempat_lahir' => $this->tempat_lahir,
            'tanggal_lahir' => $this->tanggal_lahir,
            'nik' => $this->nik,
            'nip' => $this->nip,
            'nuptk' => $this->nuptk,
            'status_kepegawaian' => $this->status_kepegawaian,
            'jenis_ptk' => $this->jenis_ptk,
            'gelar_depan' => $this->gelar_depan,
            'gelar_belakang' => $this->gelar_belakang,
            'jenjang' => $this->jenjang,
            'prodi' => $this->prodi,
            'sertifikasi' => $this->sertifikasi,
            'tmt_kerja' => $this->tmt_kerja,
            'mengajar' => $this->mengajar,
            'mapel_diampu' => $this->relationLoaded('mapels') ? $this->mapels->map(function($m) {
                return [
                    'id' => $m->id,
                    'nama' => $m->nama,
                    'kode' => $m->kode_mapel,
                    'warna' => $m->warna_hex_mapel
                ];
            }) : [],
            'tugas_tambahan' => $this->tugas_tambahan,
            'jam_tugas_tambahan' => $this->jam_tugas_tambahan,
            'jjm' => $this->jjm,
            'total_jjm' => $this->total_jjm,
            'kompetensi' => $this->kompetensi,
        ];
    }
}
