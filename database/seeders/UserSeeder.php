<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


use App\Models\User;
use App\Models\Rental;
use App\Models\Car;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::truncate(); 
    
        User::create([
            'name' => 'Marko',
            'email' => 'marko@gmail.com',
            'password' => Hash::make('1111'),
        ]);

        User::create([
            'name' => 'Janko',
            'email' => 'janko@gmail.com',
            'password' => Hash::make('1111'),
        ]);
        
    }

}
