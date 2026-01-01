<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubPenilaian extends Model
{
    use HasFactory;

    protected $table = 'sub_penilaian';
    protected $guarded = ['id'];

    public function jenisPenilaian()
    {
        return $this->belongsTo(JenisPenilaian::class);
    }

    public function nilaiSiswa()
    {
        return $this->hasMany(NilaiSiswa::class);
    }
}
