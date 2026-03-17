<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArtistTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = ['first_name', 'last_name', 'stage_name', 'bio', 'slug'];
}