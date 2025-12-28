<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @method \Illuminate\Support\Collection getRoleNames()
 * @method \Illuminate\Support\Collection getAllPermissions()
 */

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;
    
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
}

        