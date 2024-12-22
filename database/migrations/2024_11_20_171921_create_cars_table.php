<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {

        if (!Schema::hasTable('cars')) {
            Schema::create('cars', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('brand');
                $table->year('year');
                $table->string('registration_no')->unique();
                $table->enum('status', ['available', 'rented', 'maintenance'])->default('available');
                $table->decimal('price_per_day', 8, 2);
                $table->timestamps();
            });
        }
    }


    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
