<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * @method \Illuminate\Support\Collection getRoleNames()
 * @method \Illuminate\Support\Collection getAllPermissions()
 */

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;
    
    protected $fillable = [
        'username',
        'password',
        'profile_type',
        'profile_id',
        'status',
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    protected $casts = [
        'password' => 'hashed',
    ];
    
    
    public function profile()
    {
        return $this->morphTo();
    }
    
    /**
     * Relasi ke Guru (untuk API)
     */
    public function guru()
    {
        return $this->hasOne(Guru::class, 'id', 'profile_id')
            ->where('profile_type', 'App\Models\Guru');
    }
    
    /**
     * Accessor untuk name attribute
     */
    public function getNameAttribute()
    {
        if ($this->profile_type === 'App\Models\Guru' && $this->profile) {
            return $this->profile->nama;
        }
        
        if ($this->profile_type === 'App\Models\Siswa' && $this->profile) {
            return $this->profile->nama;
        }
        
        return $this->username;
    }
    
    /**
     * Accessor untuk email attribute (jika tidak ada di users table)
     */
    public function getEmailAttribute($value)
    {
        if ($value) {
            return $value;
        }
        
        // Fallback ke email dari profile jika ada
        if ($this->profile && method_exists($this->profile, 'getEmailAttribute')) {
            return $this->profile->email;
        }
        
        return null;
    }
}

        