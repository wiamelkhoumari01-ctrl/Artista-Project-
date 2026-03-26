<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArtistTranslation extends Model
{
    // Pas de timestamps pour les tables de traduction en général, sauf si tu en as mis
    public $timestamps = false; 

    protected $fillable = [
        'artist_id', 'locale', 'first_name', 'last_name', 'stage_name', 'bio', 'slug'
    ];

    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }
}