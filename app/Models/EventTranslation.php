<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = ['event_id', 'locale', 'title', 'venue_name', 'description']; // Ajoute event_id et locale

    public function event()
{
    return $this->belongsTo(Event::class);
}
}