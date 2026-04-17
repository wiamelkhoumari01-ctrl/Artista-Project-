<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Artwork extends Model
{
    protected $fillable = [
        'artist_id', 'category_id', 'image_url', 'title', 'description', 'date_creation'
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
    ];

    // L'œuvre appartient à un artiste
    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class);
    }

    // L'œuvre appartient à une catégorie
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    public function images(): HasMany
        {
            return $this->hasMany(ArtworkImage::class);
        }

}