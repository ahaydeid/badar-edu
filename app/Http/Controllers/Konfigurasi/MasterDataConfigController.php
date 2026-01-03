<?php

namespace App\Http\Controllers\Konfigurasi;

use App\Http\Controllers\Controller;
use App\Models\MasterDataConfig;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterDataConfigController extends Controller
{
    public function index()
    {
        return Inertia::render('Konfigurasi/MasterData/Index', [
            'guruConfig' => MasterDataConfig::where('key', 'guru_pegawai')->first(),
            'siswaConfig' => MasterDataConfig::where('key', 'siswa')->first(),
        ]);
    }


    public function update(Request $request, $key)
    {
        $request->validate([
            'can_edit' => 'required|boolean',
        ]);

        $config = MasterDataConfig::where('key', $key)->firstOrFail();
        $config->update([
            'can_edit' => $request->can_edit,
        ]);

        return back()->with('success', 'Konfigurasi berhasil diperbarui');
    }
}
