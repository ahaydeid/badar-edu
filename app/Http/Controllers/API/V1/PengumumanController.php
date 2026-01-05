<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use App\Http\Resources\API\V1\PengumumanResource;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;

class PengumumanController extends Controller
{
    /**
     * Get active announcements for the current user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $roleIds = $user->roles()->pluck('id')->toArray();

        $pengumuman = Pengumuman::query()
            ->where(function ($query) use ($roleIds) {
                // Filter berdasarkan role pengumuman
                $query->whereHas('roles', function ($q) use ($roleIds) {
                    $q->whereIn('roles.id', $roleIds);
                })
                // Atau pengumuman yang tidak punya role spesifik (untuk semua)
                ->orDoesntHave('roles');
            })
            ->orderByDesc('is_active')
            ->orderByDesc('tanggal_mulai')
            ->limit(10)
            ->get();

        return ApiResponse::success(
            PengumumanResource::collection($pengumuman),
            'Pengumuman retrieved successfully'
        );
    }
}
