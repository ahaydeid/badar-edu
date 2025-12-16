<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KegiatanKhusus extends Model
{
    protected $table = 'kegiatan_khusus';

    protected $fillable = [
        'nama',
        'kategori',
        'tanggal_mulai',
        'tanggal_selesai',
        'tahun',
        'is_hari_efektif',
        'status',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'tahun' => 'integer',
        'is_hari_efektif' => 'boolean',
    ];
}
