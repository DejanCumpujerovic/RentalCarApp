<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Car extends Authenticatable
{
    protected $fillable = ['name', 'brand', 'year', 'registration_no', 'status', 'price_per_day'];

    public function currentRenter()
    {
        return $this->belongsTo(User::class, 'current_renter_id');
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}