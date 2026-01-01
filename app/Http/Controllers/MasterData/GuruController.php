<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class GuruController extends Controller
{
    public function index()
    {
        return inertia('Master-Data/Guru/Index', [
            'guru' => Guru::orderBy('nama')->get(),
        ]);
    }

    public function show(Guru $guru)
{
    return inertia('Master-Data/Guru/Show', [
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

        Guru::create($data);

        return back();
    }

    public function edit(Guru $guru)
    {
        return response()->json($guru);
    }

    public function update(Request $request, Guru $guru)
    {
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
