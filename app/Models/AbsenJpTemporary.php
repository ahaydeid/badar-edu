<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsenJpTemporary extends Model
{
    protected $table = 'absen_jp_temporary';

    protected $fillable = [
        'jadwal_id',
        'siswa_id',
        'jam_masuk',
        'tanggal',
        'terlambat',
        'status_id',
        'status_absen',
    ];

    public function jadwal()
    {
        return $this->belongsTo(Jadwal::class);
    }

    public function status()
    {
        return $this->belongsTo(JenisAbsen::class, 'status_id');
    }
}
