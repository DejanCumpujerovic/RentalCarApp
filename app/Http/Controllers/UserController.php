<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display the logged-in user's rentals.
     */
    public function myRentals()
    {
        $rentals = Rental::where('user_id', Auth::id())->with('car')->get();
        return response()->json($rentals);
    }

    /**
     * View details of a specific rental.
     */
    public function rentalDetails($id)
    {
        $rental = Rental::where('id', $id)
            ->where('user_id', Auth::id())
            ->with('car')
            ->firstOrFail();

        return response()->json($rental);
    }
}