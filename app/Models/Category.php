<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['image_banner'];

    /**
     * Relation vers les traductions de la catégorie
     */
    public function category_translations(): HasMany
    {
        // Assure-toi que le nom du modèle de traduction est bien CategoryTranslation
        return $this->hasMany(CategoryTranslation::class);
    }

    /**
     * Relation vers les artistes de cette catégorie
     */
    public function artists(): HasMany
    {
        return $this->hasMany(Artist::class);
    }
}