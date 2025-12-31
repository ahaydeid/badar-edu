<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AkunGuruPegawaiController extends Controller
{
    public function index()
    {
        $allRoles = \App\Models\Role::where('name', '!=', 'devhero')->get();

        return inertia('Pengguna/Akun/GuruPegawai/Index', [
            'users' => \App\Models\User::with('profile')
                ->with('roles')
                ->whereDoesntHave('roles', fn($q) => $q->where('name', 'devhero'))
                ->where('profile_type', '!=', 'App\Models\Siswa')
                ->orderBy('username')
                ->get(),
            'allRoles' => $allRoles,
            'candidatesGuru' => \App\Models\Guru::with('user:id,profile_id,profile_type')->select('id', 'nama')->orderBy('nama')->get(),
            'candidatesSiswa' => \App\Models\Siswa::with('user:id,profile_id,profile_type')->select('id', 'nama')->orderBy('nama')->get(),
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'user_type' => ['required', 'in:guru_pegawai,siswa'],
            'user_id'   => ['required', 'integer'],
            'status'    => ['required', 'in:aktif,nonaktif,ACTIVE,INACTIVE'],
            'roles'     => ['array'],
            'roles.*'   => ['exists:roles,name'],
        ]);

        // Determine Model
        $modelClass = $request->user_type === 'guru_pegawai' ? \App\Models\Guru::class : \App\Models\Siswa::class;
        $profile = $modelClass::findOrFail($request->user_id);

        if ($profile->user()->exists()) {
             return back()->withErrors(['user_id' => 'Pengguna ini sudah memiliki akun.']);
        }

        // Generate Username
        $baseUsername = strtolower(str_replace(' ', '.', $profile->nama));
        $username = $baseUsername;
        $counter = 1;
        while (\App\Models\User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }

        // Map status to DB ENUM
        $dbStatus = in_array(strtoupper($request->status), ['AKTIF', 'ACTIVE']) ? 'ACTIVE' : 'INACTIVE';

        $user = \App\Models\User::create([
            'username'     => $username,
            'password'     => bcrypt('password'), // Global default password
            'profile_type' => $modelClass,
            'profile_id'   => $profile->id,
            'status'       => $dbStatus,
        ]);

        if ($request->has('roles')) {
            // Security check against devhero
             if (in_array('devhero', $request->roles)) {
                 // skip devhero but sync others
                 $roles = array_diff($request->roles, ['devhero']);
                 $user->syncRoles($roles);
             } else {
                 $user->syncRoles($request->roles);
             }
        }

        return back()->with('success', 'Akun berhasil dibuat. Password default: password');
    }

    public function update(\Illuminate\Http\Request $request, \App\Models\User $user)
    {
        $request->validate([
            'roles' => ['array'],
            'roles.*' => ['exists:roles,name'],
            'status' => ['required', 'in:aktif,nonaktif,ACTIVE,INACTIVE'],
        ]);

        // Prevent assigning devhero via this endpoint for security
        if (in_array('devhero', $request->roles ?? [])) {
             return back()->withErrors(['roles' => 'Cannot assign restricted role.']);
        }

        $user->syncRoles($request->roles ?? []);
        
        // Map status to DB ENUM
        $dbStatus = in_array(strtoupper($request->status), ['AKTIF', 'ACTIVE']) ? 'ACTIVE' : 'INACTIVE';
        
        $user->update(['status' => $dbStatus]);

        return back()->with('success', 'Data user berhasil diperbarui.');
    }

}
