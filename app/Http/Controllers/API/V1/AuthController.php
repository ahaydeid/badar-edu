<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\UserResource;
use App\Helpers\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Rate limiting
        $key = 'login:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return ApiResponse::error(
                "Too many login attempts. Please try again in {$seconds} seconds.",
                429
            );
        }

        // Find user by username
        $user = User::where('username', $request->username)->first();

        // Check credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key, 60); // Block for 60 seconds after 5 failed attempts
            
            return ApiResponse::unauthorized('Invalid credentials');
        }

        // Clear rate limiter on successful login
        RateLimiter::clear($key);

        // Load profile relationship (polymorphic) with mapels
        $user->load('profile.mapels');

        // Revoke all previous tokens (optional - uncomment if needed)
        // $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth-token')->plainTextToken;

        return ApiResponse::success([
            'token' => $token,
            'user' => new UserResource($user),
        ], 'Login successful');
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success(null, 'Logged out successfully');
    }

    /**
     * Get authenticated user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user()->load('profile.mapels');

        return ApiResponse::success([
            'user' => new UserResource($user),
            'can_edit_profile' => \App\Models\MasterDataConfig::where('key', 'guru_pegawai')->value('can_edit') ?? 1,
        ]);
    }

    /**
     * Refresh token
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        // Create new token
        $token = $user->createToken('auth-token')->plainTextToken;

        return ApiResponse::success([
            'token' => $token,
        ], 'Token refreshed successfully');
    }
}
