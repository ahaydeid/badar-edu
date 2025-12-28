<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AkunGuruPegawaiController extends Controller
{
    public function index()
    {
        return Inertia::render('Pengguna/Akun/GuruPegawai/Index');
    }
}
