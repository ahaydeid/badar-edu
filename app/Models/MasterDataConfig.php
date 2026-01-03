<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterDataConfig extends Model
{
    protected $fillable = [
        'key',
        'can_edit',
        'description',
    ];

    protected $casts = [
        'can_edit' => 'boolean',
    ];

    public static function canEdit($key): bool
    {
        $config = self::where('key', $key)->first();
        return $config ? $config->can_edit : true;
    }
}
