<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Pengumuman;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
   public function boot(): void
    {
        Inertia::share([
            'auth' => [
                'user' => fn () => Auth::user(),
                'menus' => fn () => \App\Support\MenuBuilder::build(),
            ],

            'topAnnouncements' => fn () =>
                Pengumuman::query()
                    ->orderByDesc('tanggal_mulai')
                    ->limit(10)
                    ->get([
                        'id',
                        'judul',
                        'isi',
                        'tanggal_mulai',
                        'is_active',
                    ]),
        ]);
    }

    
}
