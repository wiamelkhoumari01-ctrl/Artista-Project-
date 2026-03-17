<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = ['title', 'venue_name', 'description'];
}