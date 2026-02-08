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

        $seedUser = \App\Models\User::where('email', 'janko@gmail.com')->first();
        if (!$seedUser) {
            $this->command->info("User Janko not found. Run UserSeeder first.");
            return;
        }

        $seedRentalUserId = $seedUser->id;
        foreach ($cars as $car) {
            // Prošli periodi za neka vozila (da baza ima malo istorije)
            $startDate = now()->addDays(rand(-20, -1));
            $endDate = $startDate->copy()->addDays(rand(1, 7));

            if ($car->status === 'rented') {
                $rentals[] = [
                    'user_id' => $seedRentalUserId,
                    'car_id' => $car->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
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
