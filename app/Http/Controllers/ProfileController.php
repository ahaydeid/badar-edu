<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Profil/Index', [
            'user' => Auth::user(),
        ]);
    }
}
