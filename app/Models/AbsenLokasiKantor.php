<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsenLokasiKantor extends Model
{
    protected $table = 'absen_lokasi_kantor';

    protected $fillable = [
        'nama',
        'latitude',
        'longitude',
        'radius',
        'is_active',
    ];
}
