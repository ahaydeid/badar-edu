<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NilaiAkhir extends Model
{
    protected $table = 'nilai_akhir';
    
    protected $fillable = [
        'siswa_id',
        'mapel_id',
        'kelas_id',
        'semester_id',
        'guru_id',
        'nilai_akhir',
        'predikat',
        'status'
    ];

    // Relationships
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }
}
