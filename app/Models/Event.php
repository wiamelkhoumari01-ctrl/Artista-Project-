<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model implements TranslatableContract 
{
    use Translatable;

    protected $fillable = ['start_date', 'end_date', 'location_url', 'type'];
    public $translatedAttributes = ['title', 'venue_name', 'description'];

    /**
     * IMPORTANTE : Pour que le package fonctionne avec ton nom de table,
     * il faut que la méthode s'appelle exactement 'translations'.
     */
    public function translations(): HasMany 
    {
        // On lie explicitement au modèle EventTranslation
        return $this->hasMany(EventTranslation::class);
    }

    /**
     * Garde celle-ci si tu l'utilises ailleurs, mais 'translations' 
     * est celle utilisée par le package pour translate($locale).
     */
    public function event_translations(): HasMany 
    {
        return $this->hasMany(EventTranslation::class);
    }

    public function artists(): BelongsToMany
    {
        return $this->belongsToMany(Artist::class, 'artist_event');
    }
}