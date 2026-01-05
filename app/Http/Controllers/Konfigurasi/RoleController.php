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
        $isDev = auth()->user()->hasRole('devhero');
        $roles = DB::table('roles')
            ->when(!$isDev, fn($q) => $q->where('name', '!=', 'devhero'))
            ->leftJoin(
                'role_has_permissions',
                'roles.id',
                '=',
                'role_has_permissions.role_id'
            )
            ->select(
                'roles.id',
                'roles.name',
                'roles.display_name',
                'roles.description',
                DB::raw('COUNT(role_has_permissions.permission_id) as permissions_count')
            )
            ->groupBy('roles.id', 'roles.name', 'roles.display_name', 'roles.description')
            ->orderByDesc('permissions_count')
            ->get();

        $allPermissions = DB::table('permissions')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Konfigurasi/Role/Index', [
            'roles' => $roles,
            'allPermissions' => $allPermissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['array'],
            'permissions.*' => ['integer'],
        ]);

        $role = Role::create([
            'name' => strtolower($request->name),
            'display_name' => ucfirst($request->name),
            'description' => null,
            'guard_name' => 'web',
        ]);

        if (!empty($request->permissions)) {
            $permissions = \Spatie\Permission\Models\Permission::whereIn('id', $request->permissions)->get();
            $role->syncPermissions($permissions);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        return back()->with('success', 'Role baru berhasil ditambahkan.');
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
        \Illuminate\Support\Facades\Log::info('Update Permissions Request:', $request->all());

        $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['integer'],
        ]);

        $role = Role::findOrFail($roleId);
        \Illuminate\Support\Facades\Log::info("Updating Role: {$role->name} (Guard: {$role->guard_name})");

        $permissions = \Spatie\Permission\Models\Permission::whereIn(
            'id',
            $request->permissions ?? []
        )->get();

        \Illuminate\Support\Facades\Log::info("Permissions found: " . $permissions->count());
        \Illuminate\Support\Facades\Log::info("Permission IDs to sync: " . implode(',', $permissions->pluck('id')->toArray()));

        $role->syncPermissions($permissions);

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        return back();
    }

}
