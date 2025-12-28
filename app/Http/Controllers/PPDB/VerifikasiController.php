<?php

namespace App\Http\Controllers\PPDB;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class VerifikasiController extends Controller
{
    public function index()
    {
        return Inertia::render('PPDB/Verifikasi/Index');
    }
}
