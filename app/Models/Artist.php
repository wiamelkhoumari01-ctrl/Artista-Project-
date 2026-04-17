<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Artist extends Model
{
    // On garde ta structure avec stage_name, bio et specialite en JSON
    protected $fillable = [
        'user_id', 'category_id', 'image_url', 'stage_name', 
        'bio', 'specialite', 'slug', 'phone', 'country', 'city', 'website'
    ];

    // C'est ici que la magie opère pour Laravel
    protected $casts = [
        'stage_name' => 'array', // Sera stocké comme {"fr":"...", "ar":"..."}
        'bio'        => 'array',
        'specialite' => 'array',
    ];

    /**
     * Cette méthode s'assure que même si une langue est manquante en DB, 
     * l'API ne renvoie pas d'erreur pour ton Front.
     */
    public function toArray()
    {
        $array = parent::toArray();
        
        // On s'assure que ces champs sont toujours des objets pour ton front
        $array['stage_name'] = $this->stage_name ?? ['fr' => '', 'ar' => '', 'en' => ''];
        $array['bio']        = $this->bio        ?? ['fr' => '', 'ar' => '', 'en' => ''];
        $array['specialite'] = $this->specialite ?? ['fr' => '', 'ar' => '', 'en' => ''];

        return $array;
    }

    // Relations (inchangées)
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function artworks(): HasMany { return $this->hasMany(Artwork::class); }
    public function events(): BelongsToMany { return $this->belongsToMany(Event::class, 'artist_event'); }
}