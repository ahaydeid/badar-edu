<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AkunGuruPegawaiController extends Controller
{
    public function index()
    {
        $allRoles = \App\Models\Role::query()
            ->where('name', '!=', 'devhero')
            ->get();

        return inertia('Pengguna/Akun/GuruPegawai/Index', [
            'users' => \App\Models\User::with('profile')
                ->with('roles')
                ->whereDoesntHave('roles', fn($rq) => $rq->where('name', 'devhero'))
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

        if ($request->user_type === 'siswa') {
            $username = $profile->nisn;
            if (empty($username)) {
                 return back()->withErrors(['user_id' => 'Siswa ini tidak memiliki NISN. Gagal membuat akun.']);
            }
            if (\App\Models\User::where('username', $username)->exists()) {
                 return back()->withErrors(['user_id' => "Username/NISN ($username) sudah digunakan oleh akun lain."]);
            }
        } else {
            // Use Kode Guru as Username for Guru/Pegawai
            $username = $profile->kode_guru;
            
            if (empty($username)) {
                return back()->withErrors(['user_id' => 'Data guru ini tidak memiliki Kode Guru. Silakan lengkapi master data dahulu.']);
            }

            if (\App\Models\User::where('username', $username)->exists()) {
                return back()->withErrors(['user_id' => "Username/Kode Guru ($username) sudah memiliki akun."]);
            }
        }

        // Map status to DB ENUM
        $dbStatus = in_array(strtoupper($request->status), ['AKTIF', 'ACTIVE']) ? 'ACTIVE' : 'INACTIVE';

        // Use NIK as password for Guru, or default for Siswa
        $password = ($request->user_type === 'guru_pegawai') 
            ? ($profile->nik ? $profile->nik : 'password123') 
            : 'password';

        $user = \App\Models\User::create([
            'username'     => $username,
            'password'     => \Illuminate\Support\Facades\Hash::make($password),
            'profile_type' => $modelClass,
            'profile_id'   => $profile->id,
            'status'       => $dbStatus,
        ]);

        if ($request->has('roles')) {
             // Strictly filter out devhero if tried to be injected
             $roles = array_diff($request->roles, ['devhero']);
             $user->syncRoles($roles);
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

        // Prevent assigning devhero via this endpoint for non-dev users
        // Prevent assigning devhero via this endpoint
        if (in_array('devhero', $request->roles ?? [])) {
             return back()->withErrors(['roles' => 'Cannot assign restricted role.']);
        }

        $user->syncRoles($request->roles ?? []);
        
        // Map status to DB ENUM
        $dbStatus = in_array(strtoupper($request->status), ['AKTIF', 'ACTIVE']) ? 'ACTIVE' : 'INACTIVE';
        
        $user->update(['status' => $dbStatus]);

        return back()->with('success', 'Data user berhasil diperbarui.');
    }

    public function destroy(\Illuminate\Http\Request $request, \App\Models\User $user)
    {
        // Prevent deleting restricted accounts
        if ($user->hasRole('devhero')) {
             return back()->withErrors(['message' => 'Cannot delete restricted account.']);
        }

        $user->delete();

        return back()->with('success', 'Akun berhasil dihapus.');
    }

    public function resetPassword(\App\Models\User $user)
    {
        // Prevent resetting restricted accounts for non-dev users
        // Prevent resetting restricted accounts
        if ($user->hasRole('devhero')) {
            return back()->withErrors(['message' => 'Cannot reset restricted account.']);
        }

        $profile = $user->profile;
        if (!$profile) {
            return back()->withErrors(['message' => 'Akun tidak memiliki profil yang terhubung.']);
        }

        // Get default password based on profile type
        $defaultPassword = null;
        if ($user->profile_type === 'App\Models\Guru') {
            $defaultPassword = $profile->nik;
            if (empty($defaultPassword)) {
                return back()->withErrors(['message' => 'NIK guru tidak tersedia. Tidak dapat reset password.']);
            }
        } elseif ($user->profile_type === 'App\Models\Siswa') {
            $defaultPassword = $profile->nis;
            if (empty($defaultPassword)) {
                return back()->withErrors(['message' => 'NIS siswa tidak tersedia. Tidak dapat reset password.']);
            }
        } else {
            return back()->withErrors(['message' => 'Tipe profil tidak dikenali.']);
        }

        $user->update([
            'password' => bcrypt($defaultPassword),
        ]);

        return back()->with('success', "Password berhasil direset ke default ({$defaultPassword}).");
    }
}
