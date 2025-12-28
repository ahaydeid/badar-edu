<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Spatie\Permission\Exceptions\UnauthorizedException;

class PermissionOrSuperadmin
{
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            throw UnauthorizedException::notLoggedIn();
        }

        if ($user->hasRole('superadmin')) {
            return $next($request);
        }

        // fallback ke permission normal
        if ($user->hasAnyPermission($permissions)) {
            return $next($request);
        }

        throw UnauthorizedException::forPermissions($permissions);
    }
}
