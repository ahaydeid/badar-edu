<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AkunSiswaController extends Controller
{
    public function index()
    {
        $isDev = auth()->user()->hasRole('devhero');
        $allRoles = \App\Models\Role::query()
            ->when(!$isDev, fn($q) => $q->where('name', '!=', 'devhero'))
            ->get();

        return inertia('Pengguna/Akun/Siswa/Index', [
            'users' => \App\Models\User::with('profile')
                ->with('roles')
                ->when(!$isDev, fn($q) => $q->whereDoesntHave('roles', fn($rq) => $rq->where('name', 'devhero')))
                ->where('profile_type', 'App\Models\Siswa')
                ->orderBy('username')
                ->get(),
            'allRoles' => $allRoles,
            'candidatesSiswa' => \App\Models\Siswa::with('user:id,profile_id,profile_type')->select('id', 'nama')->orderBy('nama')->get(),
        ]);
    }
}
