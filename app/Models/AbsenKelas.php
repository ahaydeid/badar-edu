<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsenKelas extends Model
{
    protected $table = 'absen_kelas';

    protected $fillable = [
        'jadwal_id',
        'jam_masuk',
        'jam_pulang',
        'tanggal',
        'status_id',
        'catatan', // renamed from keterangan
        'is_selesai',
    ];

    protected $casts = [
        'is_selesai' => 'boolean',
    ];

    public function jadwal()
    {
        return $this->belongsTo(Jadwal::class, 'jadwal_id');
    }
}
