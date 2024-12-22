<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rentals', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('car_id')->constrained()->onDelete('cascade'); // Link to cars table
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Link to users table
            $table->date('start_date'); // Rental start date
            $table->date('end_date');   // Rental end date
            $table->timestamps();      // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
