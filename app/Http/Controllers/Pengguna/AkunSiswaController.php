<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AkunSiswaController extends Controller
{
    public function index()
    {
        $allRoles = \App\Models\Role::where('name', '!=', 'devhero')->get();

        return inertia('Pengguna/Akun/Siswa/Index', [
            'users' => \App\Models\User::with('profile')
                ->with('roles')
                ->whereDoesntHave('roles', fn($q) => $q->where('name', 'devhero'))
                ->where('profile_type', 'App\Models\Siswa')
                ->orderBy('username')
                ->get(),
            'allRoles' => $allRoles,
            'candidatesSiswa' => \App\Models\Siswa::with('user:id,profile_id,profile_type')->select('id', 'nama')->orderBy('nama')->get(),
        ]);
    }
}
