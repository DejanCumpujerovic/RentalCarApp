<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
        Inertia::share('auth', function () {
            $user = Auth::user();
    
            // Check if the user is authenticated and an instance of the User model
            return [
                'user' => $user && $user instanceof \App\Models\User
                    ? $user->only(['id', 'name', 'email'])
                    : null,
            ];
        });
    }
}
