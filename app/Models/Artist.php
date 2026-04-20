<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Artist extends Model
{
    protected $fillable = [
        'user_id', 'category_id', 'image_url', 'stage_name',
        'bio', 'specialite', 'slug', 'phone', 'country', 'city', 'website',
        'views_count', 'clicks_count',
    ];

    protected $casts = [
        'stage_name' => 'array',
        'bio'        => 'array',
        'specialite' => 'array',
    ];

    public function toArray()
    {
        $array = parent::toArray();
        $array['stage_name'] = $this->stage_name ?? ['fr' => '', 'ar' => '', 'en' => ''];
        $array['bio']        = $this->bio        ?? ['fr' => '', 'ar' => '', 'en' => ''];
        $array['specialite'] = $this->specialite ?? ['fr' => '', 'ar' => '', 'en' => ''];
        return $array;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function artworks(): HasMany
    {
        return $this->hasMany(Artwork::class);
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'artist_event');
    }

    public function stats(): HasMany
    {
        return $this->hasMany(ArtistStat::class);
    }
}