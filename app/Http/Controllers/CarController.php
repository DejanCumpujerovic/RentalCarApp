<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log; 
use Carbon\Carbon;

class CarController extends Controller
{
    public function index()
    {
        $cars = Car::withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->get()
            ->map(function ($car) {
                $arr = $car->toArray();
                $arr['avg_rating'] = $car->reviews_avg_rating ? round((float) $car->reviews_avg_rating, 1) : null;
                return $arr;
            });

        return Inertia::render('Home', [
            'cars' => $cars,
        ]);
    }

    /**
     * Show details of a specific car (Inertia page).
     */
    public function show(Car $car)
    {
        $car->load(['reviews' => fn ($q) => $q->with('user')->latest()]);
        $car->reviews_count = $car->reviews->count();
        $car->avg_rating = round($car->reviews->avg('rating'), 1);

        $canReview = false;
        $userReview = null;
        if (Auth::check()) {
            $userReview = $car->reviews()->where('user_id', Auth::id())->first();
            $today = Carbon::today()->toDateString();
            $hasCompletedRental = Auth::user()
                ->rentals()
                ->where('car_id', $car->id)
                ->where('end_date', '<', $today)
                ->exists();
            $canReview = (bool) $hasCompletedRental;
        }

        return Inertia::render('CarDetails', [
            'car' => $car,
            'canReview' => $canReview,
            'userReview' => $userReview,
        ]);
    }

    public function rent(Request $request)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'rental_start' => 'required|date|after_or_equal:today',
            'rental_end' => 'required|date|after:rental_start',
        ]);

        $car = Car::findOrFail($validated['car_id']);

        if ($car->status !== 'available') {
            return back()->withErrors(['car' => 'Car is not available for rent.']);
        }

        // Check for overlapping rentals
        $overlap = Rental::where('car_id', $car->id)
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_date', [$validated['rental_start'], $validated['rental_end']])
                    ->orWhereBetween('end_date', [$validated['rental_start'], $validated['rental_end']])
                    ->orWhereRaw('? BETWEEN start_date AND end_date', [$validated['rental_start']])
                    ->orWhereRaw('? BETWEEN start_date AND end_date', [$validated['rental_end']]);
            })
            ->exists();

        if ($overlap) {
            return back()->withErrors(['car' => 'Car is already rented for the selected period.']);
        }

        // Update car status
        $car->status = 'rented';
        $car->save();

        // Create a rental record
        Rental::create([
            'car_id' => $car->id,
            'user_id' => Auth::id(),
            'start_date' => $validated['rental_start'],
            'end_date' => $validated['rental_end'],
        ]);

        return redirect()->back()->with('success', 'Car rented successfully!');
    }

    /**
     * Return a rented car.
     */
    public function returnCar($id)
    {
        $car = Car::findOrFail($id);

        if ($car->current_renter_id !== Auth::id()) {
            return response()->json(['error' => 'You cannot return a car you are not renting.'], 403);
        }

        // Mark the car as available
        $car->update([
            'status' => 'available',
            'current_renter_id' => null,
        ]);

        return response()->json(['success' => 'Car returned successfully!']);
    }

    public function filterCars(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
    
        try {
            $startDate = Carbon::parse($request->input('start_date'));
            $endDate = Carbon::parse($request->input('end_date'));
    
            // Vozila dostupna u periodu = ona koja NEMAJU nijedan rental koji se preklapa sa tim periodom
            $availableCars = Car::whereDoesntHave('rentals', function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '<=', $endDate)
                      ->where('end_date', '>=', $startDate);
            })
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->get()
                ->map(function ($car) {
                    $arr = $car->toArray();
                    $arr['avg_rating'] = $car->reviews_avg_rating ? round((float) $car->reviews_avg_rating, 1) : null;
                    return $arr;
                });
    
            return response()->json([
                'cars' => $availableCars
            ]);
        } catch (\Exception $e) {
            Log::error('Error filtering cars: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    
}