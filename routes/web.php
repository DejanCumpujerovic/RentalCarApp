<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CarController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RegisteredUserController;

// Public Routes
Route::get('/', [CarController::class, 'index'])->name('home');
Route::get('/cars/{car}', [CarController::class, 'show'])->name('cars.show');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Login');
    })->name('login');
    Route::post('/login', [\App\Http\Controllers\AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

Route::post('/logout', [\App\Http\Controllers\AuthenticatedSessionController::class, 'destroy'])
    ->name('logout'); // Single logout route

// Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::get('/my-rentals', [RentalController::class, 'myRentals'])->name('my-rentals');
    Route::post('/rent', [RentalController::class, 'store']); // Rent a car
    Route::delete('/rentals/{rental}', [RentalController::class, 'destroy'])->name('rentals.destroy');
    Route::post('/cars/{car}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
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