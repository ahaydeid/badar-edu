<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MasterDataConfig;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Update Profile Data (Guru Only)
     */
    public function updateProfile(Request $request)
    {
        if (!MasterDataConfig::canEdit('guru_pegawai')) {
            return response()->json([
                'success' => false,
                'message' => 'Pengeditan data profil saat ini sedang ditutup oleh administrator.'
            ], 403);
        }

        $user = Auth::user();
        
        if ($user->profile_type !== 'App\Models\Guru') {
             return response()->json([
                'success' => false,
                'message' => 'Hanya akun Guru yang dapat mengupdate data profil.'
            ], 403);
        }

        $guru = $user->profile;

        $request->validate([
             'nama' => 'required|string|max:255',
             'nip' => 'nullable|string|max:20', 
             'nik' => 'required|string|size:16', 
             'nip' => 'nullable|unique:guru,nip,'.$guru->id,
             'nik' => 'required|unique:guru,nik,'.$guru->id,
             'nuptk' => 'nullable|unique:guru,nuptk,'.$guru->id,
             'foto' => 'nullable|image|max:2048',
        ]);

        $data = $request->except(['foto', '_method']);
        
        if ($request->hasFile('foto')) {
            if ($guru->foto && Storage::exists('public/' . $guru->foto)) {
                Storage::delete('public/' . $guru->foto);
            }
            $path = $request->file('foto')->store('guru-photos', 'public');
            $data['foto'] = $path;
        }

        $guru->update($data);

        // Update User Name as well if synced
        $user->update([
            'username' => $guru->kode_guru ?? $user->username
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data' => [
                'user' => $user->fresh(),
                'profile' => $guru->fresh()
            ]
        ]);
    }

    /**
     * Update Password
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'new_password' => 'required|string|min:8|confirmed|different:current_password',
        ]);

        $user = Auth::user();
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kata sandi berhasil diperbarui.'
        ]);
    }
}
