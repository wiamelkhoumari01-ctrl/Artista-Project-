<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    protected $fillable = [
        'start_date', 'end_date', 'type', 'title', 'venue_name', 'description', 'location_url'
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    // Un événement peut avoir plusieurs artistes
    public function artists(): BelongsToMany
    {
        return $this->belongsToMany(Artist::class, 'artist_event');
    }
}