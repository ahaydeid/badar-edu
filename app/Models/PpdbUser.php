<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class PpdbUser extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'email',
        'password',
        'nama_lengkap',
        'no_hp',
        'is_verified',
        'email_verified_at',
    ];

    public function verifications()
    {
        return $this->hasMany(PpdbVerification::class);
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_verified' => 'boolean',
    ];

    public function pendaftar()
    {
        return $this->hasOne(Pendaftar::class);
    }
}
