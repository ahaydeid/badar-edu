<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AkunSiswaController extends Controller
{
    public function index()
    {
        return Inertia::render('Pengguna/Akun/Siswa/Index');
    }
}
