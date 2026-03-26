<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArtistStat extends Model
{
    use HasFactory;

    /**
     * Désactiver les timestamps standards (created_at/updated_at) 
     * car on utilise une colonne 'date' personnalisée pour les stats journalières.
     */
    public $timestamps = false;

    /**
     * Les attributs qui peuvent être remplis massivement.
     */
    protected $fillable = [
        'artist_id',
        'date',
        'views',
        'clicks' // Ajouté pour la cohérence avec le dashboard
    ];

    /**
     * Conversion automatique des types (Casting).
     */
    protected $casts = [
        'date'   => 'date',
        'views'  => 'integer',
        'clicks' => 'integer',
    ];

    /**
     * Relation inverse : Une statistique appartient à un artiste.
     */
    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class);
    }
    
    /**
     * Scope pour récupérer facilement les stats des 30 derniers jours
     * Utilisé dans ArtistController
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('date', '>=', now()->subDays($days))->orderBy('date', 'ASC');
    }
}