<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiSiswa extends Model
{
    use HasFactory;

    protected $table = 'nilai_siswa';
    protected $guarded = ['id'];

    public function subPenilaian()
    {
        return $this->belongsTo(SubPenilaian::class);
    }

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
