<?php

namespace App\Http\Controllers\Konfigurasi;

use App\Http\Controllers\Controller;
use App\Models\SchoolSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SchoolProfileController extends Controller
{
    public function index()
    {
        // Fetch all settings and format as key-value pair
        $settings = SchoolSetting::all()->pluck('setting_value', 'setting_key');

        return Inertia::render('Konfigurasi/ProfileSekolah/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'school_name' => 'required|string|max:255',
            'school_address' => 'required|string',
            'school_phone' => 'nullable|string',
            'school_logo' => 'nullable|image|max:2048', // Max 2MB
        ]);

        $data = $request->only(['school_name', 'school_address', 'school_phone', 'kop_surat_title']);

        // Handle File Upload
        if ($request->hasFile('school_logo')) {
            // Save to 'public' disk in 'logo' folder
            $path = $request->file('school_logo')->store('logo', 'public');
            SchoolSetting::updateOrCreate(
                ['setting_key' => 'school_logo'],
                ['setting_value' => '/storage/' . $path] 
            );
        }

        // Explicitly update text fields
        $textFields = ['school_name', 'school_address', 'school_phone', 'kop_surat_title'];
        
        foreach ($textFields as $key) {
            // Only update if present in request (to avoid clearing kop_surat_title if not in form)
            if ($request->has($key)) {
                SchoolSetting::updateOrCreate(
                    ['setting_key' => $key],
                    ['setting_value' => $request->input($key)]
                );
            }
        }

        return redirect()->back()->with('success', 'Profil sekolah berhasil diperbarui.');
    }
}
