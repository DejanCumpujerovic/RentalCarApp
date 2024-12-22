<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Rental;
use App\Models\Car;

class RentalsTableSeeder extends Seeder
{
    public function run()
    {
        // Fetch all cars from the database
        $cars = Car::all();

        // Check if there are cars to create rental records
        if ($cars->isEmpty()) {
            $this->command->info("No cars found in the database. Please seed the Cars table first.");
            return;
        }

        $rentals = [];

        foreach ($cars as $car) {
            // Generate random dates for the rental period
            $startDate = now()->addDays(rand(-20, -1)); // Past dates
            $endDate = $startDate->copy()->addDays(rand(1, 7)); // Duration of 1-7 days

            // Check if the car is already rented
            if ($car->status === 'rented') {
                // Create a rental record for this car
                $rentals[] = [
                    'user_id' => rand(1, 10), // Assume we have user IDs from 1 to 10
                    'car_id' => $car->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'total_price' => $car->price_per_day * $startDate->diffInDays($endDate),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Optionally mark the car as available after the end date
            if ($endDate < now()) {
                $car->update(['status' => 'available']);
            }
        }

        // Insert rental records into the database
        Rental::insert($rentals);

        $this->command->info("Rental records seeded successfully!");
    }
}
