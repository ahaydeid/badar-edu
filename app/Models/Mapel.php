<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mapel extends Model
{
    protected $table = 'mapel';

    protected $fillable = [
        'kode_mapel',
        'nama',
        'kategori',
        'tingkat',
        'jurusan_id',
        'warna_hex_mapel',
    ];

    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class, 'jurusan_id');
    }

    public function jadwal()
    {
        return $this->hasMany(Jadwal::class, 'mapel_id');
    }
}
