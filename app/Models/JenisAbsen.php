<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisAbsen extends Model
{
    protected $table = 'jenis_absen';

    protected $fillable = [
        "kode","nama","kategori","status"
    ];

    public function absensiGuru()
    {
        return $this->hasMany(AbsenGuru::class, 'status_id');
    }
}
