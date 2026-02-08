<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Car;
use App\Models\Rental;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RentalController extends Controller
{
    /**
     * Prikaz rezervacija ulogovanog korisnika (Inertia).
     */
    public function myRentals()
    {
        $rentals = Auth::user()
            ->rentals()
            ->with('car')
            ->whereNotNull('total_price')
            ->orderBy('start_date', 'desc')
            ->get();

        return Inertia::render('MyRentals', [
            'rentals' => $rentals,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'start_date' => 'required|date|before:end_date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $car = Car::findOrFail($validated['car_id']);
        $start = \Carbon\Carbon::parse($validated['start_date']);
        $end = \Carbon\Carbon::parse($validated['end_date']);
        $days = $start->diffInDays($end) + 1;
        $totalPrice = round($days * $car->price_per_day, 2);

        Rental::create([
            'user_id' => Auth::id(),
            'car_id' => $validated['car_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_price' => $totalPrice,
        ]);
    
        // Update the car's status to "rented"
        Car::where('id', $validated['car_id'])->update(['status' => 'rented']);
    
        return redirect()->back()->with('success', 'Car successfully rented!');
    }

    /**
     * Cancel a rental (only future rentals).
     */
    public function destroy(Rental $rental)
    {
        // Ensure the rental belongs to the authenticated user
        if ($rental->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'You can only cancel your own reservations.');
        }

        // Only allow cancelling future rentals (start_date > today)
        if ($rental->start_date <= now()->toDateString()) {
            return redirect()->back()->with('error', 'You can only cancel future reservations.');
        }

        $car = $rental->car;

        $rental->delete();

        // Set car back to available if no other active rentals overlap
        $hasOtherActiveRentals = Rental::where('car_id', $car->id)
            ->where('end_date', '>=', now()->toDateString())
            ->exists();

        if (!$hasOtherActiveRentals) {
            $car->update(['status' => 'available']);
        }

        return redirect()->back()->with('success', 'Reservation cancelled successfully.');
    }
}

