<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Astrotomic\Translatable\Translatable;

class Artist extends Model implements TranslatableContract {
    use Translatable;

    protected $fillable = ['user_id', 'category_id', 'image_url', 'phone', 'country', 'city', 'website', 'views_count', 'clicks_count'];
    
    // Attributs traduisibles
    public $translatedAttributes = ['first_name', 'last_name', 'stage_name', 'bio', 'slug'];
    
    public function category()
{
    return $this->belongsTo(Category::class);
}
    public function artist_translations(): HasMany
    {
        return $this->hasMany(ArtistTranslation::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function artworks() {
        return $this->hasMany(Artwork::class);
    }

    public function events() {
        return $this->belongsToMany(Event::class, 'artist_event');
    }

}