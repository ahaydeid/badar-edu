<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    protected $table = 'jadwal';

    protected $fillable = [
        "hari_id","jam_id","kelas_id","guru_id","mapel_id","semester_id"
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function hari()
    {
        return $this->belongsTo(Hari::class);
    }

    public function jam()
    {
        return $this->belongsTo(Jam::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}
