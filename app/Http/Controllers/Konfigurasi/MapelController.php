<?php

namespace App\Http\Controllers\Konfigurasi;

use App\Http\Controllers\Controller;
use App\Models\Mapel;
use Inertia\Inertia;

class MapelController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/Mapel/Index', [
            'mapel' => Mapel::with('jurusan:id,nama')
                ->orderBy('nama')
                ->get(),
        ]);
    }
}
