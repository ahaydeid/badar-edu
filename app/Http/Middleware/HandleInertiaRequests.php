<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $profile = $user?->profile;

        return [
            ...parent::share($request),
           'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'nama' => $profile?->nama,
                    'gelar_depan' => $profile?->gelar_depan,
                    'gelar_belakang' => $profile?->gelar_belakang,
                    'foto' => $profile?->foto,
                    'kode_guru' => $profile?->kode_guru,
                    'jk' => $profile?->jk,
                    'tempat_lahir' => $profile?->tempat_lahir,
                    'tanggal_lahir' => $profile?->tanggal_lahir,
                    'nip' => $profile?->nip,
                    'nik' => $profile?->nik,
                    'nuptk' => $profile?->nuptk,
                    'status_kepegawaian' => $profile?->status_kepegawaian,
                    'jenis_ptk' => $profile?->jenis_ptk,
                    'tmt_kerja' => $profile?->tmt_kerja,
                    'jenjang' => $profile?->jenjang,
                    'prodi' => $profile?->prodi,
                    'sertifikasi' => $profile?->sertifikasi,
                    'mengajar' => $profile?->mengajar,
                    'jjm' => $profile?->jjm,
                    'total_jjm' => $profile?->total_jjm,
                    'tugas_tambahan' => $profile?->tugas_tambahan,
                    'jam_tugas_tambahan' => $profile?->jam_tugas_tambahan,
                    'kompetensi' => $profile?->kompetensi,
                ] : null,
                'roles' => $request->user()?->getRoleNames(),
                'permissions' => $user ? $user->getAllPermissions()->pluck('name')->toArray() : [],
            ],

        ];
    }


}
