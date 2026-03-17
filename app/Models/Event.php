<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Relations\HasMany; // <--- AJOUT INDISPENSABLE
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // <--- CONSEILLÉ

class Event extends Model implements TranslatableContract {
    use Translatable;

    protected $fillable = ['start_date', 'end_date', 'location_url', 'type'];
    public $translatedAttributes = ['title', 'venue_name', 'description'];

    /**
     * Relation vers les traductions multilingues.
     * On ajoute ": HasMany" pour respecter le contrat du package.
     */
    public function translations(): HasMany 
    {
        return $this->hasMany(EventTranslation::class);
    }

    /**
     * Relation Pivot pour lier un ou plusieurs artistes à une tournée.
     */
    public function artists(): BelongsToMany
    {
        return $this->belongsToMany(Artist::class, 'artist_event');
    }
}