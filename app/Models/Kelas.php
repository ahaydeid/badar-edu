<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Guru;

class Kelas extends Model
{
    protected $table = 'kelas';

    protected $fillable = [
        'nama',
        'tingkat',
        'jurusan_id',
        'wali_guru_id',
    ];

    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class, 'jurusan_id');
    }

    public function wali()
    {
        return $this->belongsTo(Guru::class, 'wali_guru_id');
    }

    public function jadwal()
    {
        return $this->hasMany(Jadwal::class, 'kelas_id');
    }

    public function siswa()
    {
        return $this->hasMany(Siswa::class, 'rombel_saat_ini');
    }

}
