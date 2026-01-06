<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Models\MasterDataConfig;

class ProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Profil/Index', [
            'user' => Auth::user(),
            // Eager load profile if needed
            'guru' => Auth::user()->profile_type === 'App\Models\Guru' 
                ? Auth::user()->profile 
                : null,
            'canEdit' => MasterDataConfig::canEdit('guru_pegawai'),
        ]);
    }

    public function settings()
    {
        $user = Auth::user();
        $guru = null;

        if ($user->profile_type === 'App\Models\Guru') {
           $guru = $user->profile;
        }

        return Inertia::render('Profil/Settings', [
            'user' => $user,
            'guru' => $guru,
            'canEdit' => MasterDataConfig::canEdit('guru_pegawai'),
        ]);
    }

    public function updateData(\Illuminate\Http\Request $request)
    {
        if (!MasterDataConfig::canEdit('guru_pegawai')) {
            return back()->with('error', 'Pengeditan data profil sedang ditutup.');
        }

        $user = Auth::user();
        
        if ($user->profile_type !== 'App\Models\Guru') {
            return back()->with('error', 'Hanya akun Guru yang dapat mengupdate data profil.');
        }

        $guru = $user->profile;

        // Validation (Similiar to GuruController but usually less strict on uniques if self-update)
        $request->validate([
             'nama' => 'required|string|max:255',
             'nip' => 'nullable|string|max:20', 
             'nik' => 'required|string|size:16', 
             // Unique checks need ignore
             'nip' => 'nullable|unique:guru,nip,'.$guru->id,
             'nik' => 'required|unique:guru,nik,'.$guru->id,
             'nuptk' => 'nullable|unique:guru,nuptk,'.$guru->id,
             'foto' => 'nullable|image|max:2048',
        ]);

        $data = $request->except(['foto', '_method']);
        
        if ($request->hasFile('foto')) {
            // Delete old
            if ($guru->foto && \Illuminate\Support\Facades\Storage::exists('public/' . $guru->foto)) {
                \Illuminate\Support\Facades\Storage::delete('public/' . $guru->foto);
            }
            $path = $request->file('foto')->store('guru-photos', 'public');
            $data['foto'] = $path;
        }

        $guru->update($data);

        // Update User Name as well if synced
        $user->update([
            'username' => $guru->kode_guru ?? $user->username
            // Password intentionally not updated here
        ]);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }
    public function updatePassword(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'new_password' => 'required|string|min:8|confirmed|different:current_password',
        ]);

        $user = Auth::user();
        $user->update([
            'password' => \Illuminate\Support\Facades\Hash::make($request->new_password),
        ]);

        return back()->with('success', 'Kata sandi berhasil diperbarui.');
    }
}
