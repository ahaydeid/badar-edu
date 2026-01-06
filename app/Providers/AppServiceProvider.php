<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
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
        // Force HTTPS in production
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        Inertia::share([
            'auth' => [
                'user' => fn () => Auth::user(),
                'menus' => fn () => \App\Support\MenuBuilder::build(),
            ],

            'topAnnouncements' => function () {
                $user = Auth::user();

                $query = Pengumuman::query();

                if ($user) {
                    $userRoleIds = $user->roles()->pluck('id')->toArray();
                    $query->where(function ($q) use ($userRoleIds) {
                        $q->whereDoesntHave('roles')
                          ->orWhereHas('roles', function ($rq) use ($userRoleIds) {
                              $rq->whereIn('roles.id', $userRoleIds);
                          });
                    });
                } else {
                    $query->whereDoesntHave('roles');
                }

                return $query->orderByDesc('is_active')
                    ->orderByDesc('tanggal_mulai')
                    ->limit(10)
                    ->get(['id', 'judul', 'isi', 'tanggal_mulai', 'is_active', 'gambar']);
            },
        ]);
    }

    
}
