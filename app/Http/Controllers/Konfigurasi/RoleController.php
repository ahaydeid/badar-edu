<?php

namespace App\Http\Controllers\Konfigurasi;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// use Spatie\Permission\Models\Role;
use App\Models\Role;
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

    public function editPermissions($roleId)
    {
        $role = DB::table('roles')
            ->where('id', $roleId)
            ->select('id', 'name')
            ->first();

        $allPermissions = DB::table('permissions')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        $rolePermissions = DB::table('permissions')
            ->join(
                'role_has_permissions',
                'permissions.id',
                '=',
                'role_has_permissions.permission_id'
            )
            ->where('role_has_permissions.role_id', $roleId)
            ->select('permissions.id', 'permissions.name')
            ->get();

        return Inertia::render('Konfigurasi/Role/EditPermissions', [
            'role' => $role,
            'allPermissions' => $allPermissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function updatePermissions(Request $request, $roleId)
    {
        $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['integer'],
        ]);

        $role = Role::findOrFail($roleId);

        $permissions = \Spatie\Permission\Models\Permission::whereIn(
            'id',
            $request->permissions ?? []
        )->get();

        $role->syncPermissions($permissions);

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        return back();
    }

}
