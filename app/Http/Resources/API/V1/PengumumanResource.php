<?php

namespace App\Http\Resources\API\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PengumumanResource extends JsonResource
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
            'judul' => $this->judul,
            'isi' => $this->isi,
            'gambar' => $this->gambar ? asset('storage/' . $this->gambar) : null,
            'tanggal_mulai' => $this->tanggal_mulai->format('Y-m-d'),
            'tanggal_selesai' => $this->tanggal_selesai->format('Y-m-d'),
            'is_active' => (bool) $this->is_active,
        ];
    }
}
