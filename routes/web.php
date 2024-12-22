<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CarController;
use App\Http\Controllers\RentalController;

// Public Routes
Route::get('/', [CarController::class, 'index'])->name('home'); // Home with Car list

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Login');
    })->name('login');
    Route::post('/login', [\App\Http\Controllers\AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [\App\Http\Controllers\AuthenticatedSessionController::class, 'destroy'])
    ->name('logout'); // Single logout route

// Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::post('/rent', [RentalController::class, 'store']); // Rent a car
    Route::get('/home', function () {
        return Inertia::render('Home', [
            'user' => Auth::user(), // Authenticated user
        ]);
    });
});


Route::post('/filterCars', [CarController::class, 'filterCars']);

Route::get('/login', function () {
    // Check if the user is already authenticated
    if (Auth::check()) {
        return Inertia::location('/');  // Redirect to home page if already logged in
    }
    return Inertia::render('Login');  // Render login page if not authenticated
})->name('login');