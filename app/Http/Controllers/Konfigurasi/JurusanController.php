<?php

namespace App\Http\Controllers\Konfigurasi;

use App\Http\Controllers\Controller;
use App\Models\Jurusan;
use Inertia\Inertia;

class JurusanController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/Jurusan/Index', [
            'jurusan' => Jurusan::with('kepalaProgram:id,nama')
                ->orderBy('nama')
                ->get(),
        ]);
    }
}
