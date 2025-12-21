<?php

namespace App\Http\Controllers\Konfigurasi;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/Role/Index', [
            'roles' => Role::withCount('permissions')
                ->orderBy('display_name')
                ->get(),
        ]);
    }
}
