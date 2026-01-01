<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PendaftarDokumen extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'is_valid' => 'boolean',
    ];

    public function pendaftar()
    {
        return $this->belongsTo(Pendaftar::class);
    }
}
