<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtworkImage extends Model
{
    use HasFactory;

    // Autoriser le remplissage de ces champs
    protected $fillable = ['artwork_id', 'path', 'is_main'];

    /**
     * Relation inverse : l'image appartient à une œuvre
     */
    public function artwork()
    {
        return $this->belongsTo(Artwork::class);
    }
}