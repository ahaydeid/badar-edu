<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AkunGuruPegawaiController extends Controller
{
    public function index()
    {
        return inertia('Pengguna/Akun/GuruPegawai/Index', [
            'users' => \App\Models\User::with('profile')
                ->with('roles')
                ->orderBy('username')
                ->get(),
        ]);
    }

}
