<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['image_banner', 'name'];
        protected $casts = [
        'name' => 'array'
    ];

    // Si tu décides de traduire les noms de catégories plus tard :
    // protected $casts = ['name' => 'array'];

    // Une catégorie contient plusieurs artistes
    public function artists(): HasMany
    {
        return $this->hasMany(Artist::class);
    }

    // Une catégorie contient plusieurs œuvres
    public function artworks(): HasMany
    {
        return $this->hasMany(Artwork::class);
    }
}