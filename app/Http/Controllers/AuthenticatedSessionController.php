<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class AuthenticatedSessionController extends Controller
{

    public function store(Request $request)
    {
        // Validate the login form
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        // Attempt to authenticate
        if (Auth::attempt($credentials)) {
            // Regenerate session to prevent session fixation
            $request->session()->regenerate();
    
            // Redirect to the intended location or home (full page reload to avoid SPA nav bug)
            return Inertia::location(redirect()->intended('/')->getTargetUrl());
        }
    
        // If authentication fails, return a generic error
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }



    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    
        return redirect('/');
    }
}