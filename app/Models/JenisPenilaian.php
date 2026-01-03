<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JenisPenilaian extends Model
{
    use HasFactory;

    protected $table = 'jenis_penilaian';
    protected $guarded = ['id'];
    
    protected $casts = [
        'has_sub' => 'boolean',
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function subPenilaian()
    {
        return $this->hasMany(SubPenilaian::class);
    }
}
