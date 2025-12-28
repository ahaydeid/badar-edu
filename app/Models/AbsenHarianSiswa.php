<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsenHarianSiswa extends Model
{
    protected $table = 'absen_harian_siswa';

    protected $fillable = [
        'siswa_id',
        'tanggal',
        'status_id',
        'keterangan',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }

    public function status()
    {
        return $this->belongsTo(JenisAbsen::class, 'status_id');
    }
}

