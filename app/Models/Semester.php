<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    protected $table = 'semester';

    protected $fillable = [
        'nama',
        'tipe',
        'tahun_ajaran_dari',
        'tahun_ajaran_sampai',
        'tanggal_mulai',
        'tanggal_selesai',
    ];
}
