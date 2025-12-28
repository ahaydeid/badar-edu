<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalSiswa extends Model
{
    protected $table = 'jadwal_siswa';

    protected $fillable = [
        'hari_id',
        'kelas_id',
        'jam_masuk',
        'jam_pulang',
    ];

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function hari()
    {
        return $this->belongsTo(Hari::class, 'hari_id');
    }
}
