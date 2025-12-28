<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsenJp extends Model
{
    protected $table = 'absen_jp';

    protected $fillable = [
        'jadwal_id',
        'siswa_id',
        'tanggal',
        'bulan',
        'semester_id',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function jadwal()
    {
        return $this->belongsTo(Jadwal::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}
