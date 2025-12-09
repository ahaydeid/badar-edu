<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaliSiswa extends Model
{
    protected $table = 'wali_siswa';

    protected $fillable = [
        'siswa_id', 'jenis_wali', 'nama', 'tahun_lahir',
        'jenjang_pendidikan', 'pekerjaan', 'penghasilan', 'nik'
    ];
}
