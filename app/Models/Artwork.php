<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;

class Artwork extends Model implements TranslatableContract {
    use Translatable;

    protected $fillable = ['artist_id', 'category_id', 'image_url', 'date_creation'];
    public $translatedAttributes = ['title', 'description'];

    public function artist() {
        return $this->belongsTo(Artist::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }
}
