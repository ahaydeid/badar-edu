<?php

namespace App\Http\Controllers\Konfigurasi;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = DB::table('roles')
            ->leftJoin(
                'role_has_permissions',
                'roles.id',
                '=',
                'role_has_permissions.role_id'
            )
            ->select(
                'roles.id',
                DB::raw('roles.name as name'),
                DB::raw('roles.name as display_name'),
                DB::raw('NULL as description'),
                DB::raw('COUNT(role_has_permissions.permission_id) as permissions_count')
            )
            ->groupBy('roles.id', 'roles.name')
            ->orderByDesc('permissions_count')
            ->get();

        return Inertia::render('Konfigurasi/Role/Index', [
            'roles' => $roles,
        ]);
    }
}
