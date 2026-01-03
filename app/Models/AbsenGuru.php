<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsenGuru extends Model
{
    protected $table = 'absen_guru';

    protected $fillable = [
        "jadwal_id",
        "guru_id",
        "tanggal",
        "jam_masuk",
        "latitude",
        "longitude",
        "foto_selfie",
        "is_in_range",
        "status_verifikasi",
        "verified_by",
        "verified_at",
        "jam_pulang",
        "status_id",
        "keterangan",
        "jp_total"
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'guru_id');
    }

    public function jadwal()
    {
        return $this->belongsTo(Jadwal::class, 'jadwal_id');
    }

    public function status()
    {
        return $this->belongsTo(JenisAbsen::class, 'status_id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
