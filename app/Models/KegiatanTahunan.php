<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KegiatanTahunan extends Model
{
    protected $table = 'kegiatan_tahunan';

    protected $fillable = [
        'nama',
        'kategori',
        'tanggal',
        'bulan',
        'is_hari_efektif',
        'status',
    ];

    protected $casts = [
        'is_hari_efektif' => 'boolean',
        'tanggal' => 'integer',
        'bulan' => 'integer',
    ];
}
