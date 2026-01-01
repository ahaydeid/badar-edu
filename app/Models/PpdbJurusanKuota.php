<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PpdbJurusanKuota extends Pivot
{
    protected $table = 'ppdb_jurusan_kuota';
    
    protected $fillable = [
        'ppdb_period_id',
        'jurusan_id',
        'kuota',
        'terisi'
    ];
}
