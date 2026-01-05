<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    protected $table = 'jadwal';

    protected $fillable = [
        "hari_id","jam_id","kelas_id","guru_id","mapel_id","semester_id",
        "parent_id","version","berlaku_dari","berlaku_sampai","is_active"
    ];

    protected $casts = [
        'berlaku_dari' => 'date',
        'berlaku_sampai' => 'date',
        'is_active' => 'boolean',
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function hari()
    {
        return $this->belongsTo(Hari::class);
    }

    public function jam()
    {
        return $this->belongsTo(Jam::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    // Versioning relationships
    public function parent()
    {
        return $this->belongsTo(Jadwal::class, 'parent_id');
    }

    public function versions()
    {
        return $this->hasMany(Jadwal::class, 'parent_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeEffectiveOn($query, $date)
    {
        return $query->where(function($q) use ($date) {
            $q->whereNull('berlaku_dari')
              ->orWhere('berlaku_dari', '<=', $date);
        })->where(function($q) use ($date) {
            $q->whereNull('berlaku_sampai')
              ->orWhere('berlaku_sampai', '>=', $date);
        });
    }

    // Event hooks for protection
    protected static function booted()
    {
        static::updating(function ($jadwal) {
            // Prevent direct updates if attendance data exists
            // This forces use of versioning system
            if ($jadwal->isDirty(['guru_id', 'mapel_id', 'kelas_id', 'hari_id', 'jam_id'])) {
                // Check if there's attendance data
                $hasAbsenGuru = \DB::table('absen_guru')
                    ->where('jadwal_id', $jadwal->id)
                    ->exists();
                    
                $hasAbsenJp = \DB::table('absen_jp')
                    ->where('jadwal_id', $jadwal->id)
                    ->exists();
                
                if ($hasAbsenGuru || $hasAbsenJp) {
                    throw new \Exception(
                        'Jadwal tidak dapat diubah langsung karena sudah memiliki data absensi. ' .
                        'Gunakan JadwalVersionService::createNewVersion() untuk membuat versi baru.'
                    );
                }
            }
        });
    }
}
