<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a review for a car.
     * User must have a completed rental for the car to review.
     */
    public function store(Request $request, Car $car)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Check user has completed a rental for this car
        $hasCompletedRental = Auth::user()
            ->rentals()
            ->where('car_id', $car->id)
            ->where('end_date', '<', now()->toDateString())
            ->exists();

        if (!$hasCompletedRental) {
            return redirect()->back()->with('error', 'You can only review cars you have rented.');
        }

        // Update or create (one review per user per car)
        Review::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'car_id' => $car->id,
            ],
            [
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
            ]
        );

        return redirect()->back()->with('success', 'Thank you for your review!');
    }
}
