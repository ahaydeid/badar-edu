<?php

namespace App\Http\Controllers\PPDB;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DaftarUlangController extends Controller
{
    public function index()
    {
        return Inertia::render('PPDB/DaftarUlang/Index');
    }
}
