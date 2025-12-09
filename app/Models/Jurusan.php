<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Guru;
use App\Models\Mapel;
use App\Models\Kelas;

class Jurusan extends Model
{
    protected $table = 'jurusan';

    protected $fillable = [
        'nama',
        'kode',
        'deskripsi',
        'kepala_program_id',
    ];

    public function kepalaProgram()
    {
        return $this->belongsTo(Guru::class, 'kepala_program_id');
    }

    public function mapel()
    {
        return $this->hasMany(Mapel::class, 'jurusan_id');
    }

    public function kelas()
    {
        return $this->hasMany(Kelas::class, 'jurusan_id');
    }
}
