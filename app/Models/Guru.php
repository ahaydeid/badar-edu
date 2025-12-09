<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    protected $table = 'guru';

    protected $fillable = [
        "nama","nuptk","jk","tempat_lahir","tanggal_lahir","nip",
        "status_kepegawaian","jenis_ptk","gelar_depan","gelar_belakang",
        "jenjang","prodi","sertifikasi","tmt_kerja","tugas_tambahan",
        "mengajar","jam_tugas_tambahan","jjm","total_jjm","kompetensi"
    ];

    public function absensi()
    {
        return $this->hasMany(AbsenGuru::class, 'guru_id');
    }
}
