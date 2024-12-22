<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarSeeder extends Seeder
{
    public function run()
    {
        DB::table('cars')->insert([
            [
                'name' => 'Toyota Corolla',
                'brand' => 'Toyota',
                'year' => 2020,
                'registration_no' => 'ABC1234',
                'status' => 'available',
                'price_per_day' => 40.00,
            ],
            [
                'name' => 'Honda Civic',
                'brand' => 'Honda',
                'year' => 2019,
                'registration_no' => 'XYZ5678',
                'status' => 'available',
                'price_per_day' => 35.00,
            ],
            [
                'name' => 'Ford Fiesta',
                'brand' => 'Ford',
                'year' => 2021,
                'registration_no' => 'LMN9876',
                'status' => 'maintenance', // Car under maintenance
                'price_per_day' => 30.00,
            ],
            [
                'name' => 'BMW 3 Series',
                'brand' => 'BMW',
                'year' => 2022,
                'registration_no' => 'QWE1112',
                'status' => 'rented', // Car currently rented
                'price_per_day' => 70.00,
            ],
            [
                'name' => 'Tesla Model 3',
                'brand' => 'Tesla',
                'year' => 2023,
                'registration_no' => 'TES1234',
                'status' => 'available',
                'price_per_day' => 120.00,
            ],
            [
                'name' => 'Chevrolet Malibu',
                'brand' => 'Chevrolet',
                'year' => 2018,
                'registration_no' => 'CHE5678',
                'status' => 'available',
                'price_per_day' => 45.00,
            ],
            [
                'name' => 'Audi A4',
                'brand' => 'Audi',
                'year' => 2020,
                'registration_no' => 'AUD1112',
                'status' => 'rented', // Car currently rented
                'price_per_day' => 100.00,
            ]
        ]);
    }
}
