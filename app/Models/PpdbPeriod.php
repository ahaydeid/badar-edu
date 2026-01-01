<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpdbPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'tahun_ajaran',
        'gelombang',
        'start_date',
        'end_date',
        'status',
        'deskripsi',
        'committee_name',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function jurusans()
    {
        return $this->belongsToMany(Jurusan::class, 'ppdb_jurusan_kuota')
                    ->withPivot('kuota', 'terisi')
                    ->withTimestamps();
    }

    public function pendaftars()
    {
        return $this->hasMany(Pendaftar::class);
    }
}
