<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArtworkTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = ['artwork_id', 'locale', 'title', 'description']; // Ajoute artwork_id et locale
}