<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pendaftar extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(PpdbUser::class, 'ppdb_user_id');
    }

    public function period()
    {
        return $this->belongsTo(PpdbPeriod::class, 'ppdb_period_id');
    }

    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class);
    }

    public function dokumens()
    {
        return $this->hasMany(PendaftarDokumen::class);
    }
}
