<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpdbVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'ppdb_user_id',
        'otp_code',
        'expires_at',
        'attempts',
        'type',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(PpdbUser::class, 'ppdb_user_id');
    }
}
