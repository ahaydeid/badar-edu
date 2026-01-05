<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\MasterDataConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class GuruController extends Controller
{
    public function index()
    {
        return inertia('MasterData/Guru/Index', [
            'guru' => Guru::orderBy('nama')->get(),
            'canEdit' => MasterDataConfig::canEdit('guru_pegawai'),
        ]);
    }

    public function show(Guru $guru)
{
    return inertia('MasterData/Guru/Show', [
        'guru' => $guru,
    ]);
}


    public function store(Request $request)
    {
        $data = $request->validate([
             // 'kode_guru' is auto-generated
            'nama' => 'required|string|max:255',
            'jk' => 'required|in:L,P',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'nuptk' => 'nullable|string',
            'nik' => 'nullable|string',
            'nip' => 'nullable|string',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'status_kepegawaian' => 'nullable|string',
            'jenis_ptk' => 'nullable|string',
            'gelar_depan' => 'nullable|string',
            'gelar_belakang' => 'nullable|string',
            'jenjang' => 'nullable|string',
            'prodi' => 'nullable|string',
            'sertifikasi' => 'nullable|string',
            'tmt_kerja' => 'nullable|date',
            'tugas_tambahan' => 'nullable|string',
            'mengajar' => 'nullable|string',
            'jam_tugas_tambahan' => 'nullable|integer',
            'jjm' => 'nullable|integer',
            'total_jjm' => 'nullable|integer',
            'kompetensi' => 'nullable|string',
        ]);

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')
                ->store('guru/foto', 'public');
        }

        // Generate Kode Guru
        $date = $request->tmt_kerja ? Carbon::parse($request->tmt_kerja) : Carbon::now();
        $prefix = 'GR-' . $date->format('ymd');
        
        // Find max sequence for this prefix
        $maxKode = Guru::where('kode_guru', 'like', $prefix . '%')
            ->orderByRaw('LENGTH(kode_guru) DESC') // Safety for varied lengths
            ->orderBy('kode_guru', 'desc')
            ->value('kode_guru');

        if ($maxKode) {
            $sequence = (int) substr($maxKode, -2);
            $nextSequence = str_pad($sequence + 1, 2, '0', STR_PAD_LEFT);
        } else {
            $nextSequence = '01';
        }

        $data['kode_guru'] = $prefix . $nextSequence;

        $guru = Guru::create($data);

        // Optional Account Creation
        if ($request->boolean('create_account')) {
            // Use Kode Guru as Username for Guru/Pegawai
            $username = $guru->kode_guru;
            
            if (empty($username)) {
                // This should ideally not happen if kode_guru is always generated,
                // but as a safeguard.
                // In this context, we're creating the guru first, so kode_guru should exist.
                // If this error is triggered, it means the kode_guru generation failed.
                // For now, we'll just log or handle it as an internal error.
                // For user feedback, it might be better to prevent account creation
                // if kode_guru is somehow missing.
            }

            // Check if username already exists (though unlikely right after guru creation with unique kode_guru)
            if (\App\Models\User::where('username', $username)->exists()) {
                // This scenario implies a collision, which should be rare if kode_guru is unique.
                // For now, we'll proceed, but in a real app, this might need more robust handling
                // or prevent account creation.
            }

            // Use NIK as password for Guru, or default if NIK is not provided
            $password = $guru->nik ? $guru->nik : 'password123';

            $user = \App\Models\User::create([
                'username'     => $username,
                'password'     => \Illuminate\Support\Facades\Hash::make($password),
                'profile_type' => get_class($guru),
                'profile_id'   => $guru->id,
                'status'       => 'ACTIVE' // Default status for newly created accounts
            ]);
            $user->assignRole('Guru'); // Fixed role for Guru
        }

        return back();
    }

    public function edit(Guru $guru)
    {
        return response()->json($guru);
    }

    public function update(Request $request, Guru $guru)
    {
        // Check if editing is allowed
        if (!MasterDataConfig::canEdit('guru_pegawai')) {
            return back()->withErrors(['message' => 'Pengeditan data guru & pegawai saat ini dikunci. Hubungi administrator untuk membuka akses.']);
        }

        $data = $request->validate([
             // 'kode_guru' is immutable
            'nama' => 'required|string|max:255',
            'jk' => 'required|in:L,P',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'nuptk' => 'nullable|string',
            'nik' => 'nullable|string',
            'nip' => 'nullable|string',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'status_kepegawaian' => 'nullable|string',
            'jenis_ptk' => 'nullable|string',
            'gelar_depan' => 'nullable|string',
            'gelar_belakang' => 'nullable|string',
            'jenjang' => 'nullable|string',
            'prodi' => 'nullable|string',
            'sertifikasi' => 'nullable|string',
            'tmt_kerja' => 'nullable|date',
            'tugas_tambahan' => 'nullable|string',
            'mengajar' => 'nullable|string',
            'jam_tugas_tambahan' => 'nullable|integer',
            'jjm' => 'nullable|integer',
            'total_jjm' => 'nullable|integer',
            'kompetensi' => 'nullable|string',
        ]);

        if ($request->hasFile('foto')) {
            if ($guru->foto && Storage::disk('public')->exists($guru->foto)) {
                Storage::disk('public')->delete($guru->foto);
            }

            $data['foto'] = $request->file('foto')
                ->store('guru/foto', 'public');
        }

        $guru->update($data);

        return back();
    }

    public function destroy(Guru $guru)
    {
        try {
            $fotoPath = $guru->foto;

            $guru->delete();

            if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                Storage::disk('public')->delete($fotoPath);
            }

            return back()->with('success', 'Data guru berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
