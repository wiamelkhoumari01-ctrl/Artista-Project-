<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArtistStat extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'artist_id',
        'date',
        'views',
        'clicks',
    ];

    
    protected $casts = [
        'views'  => 'integer',
        'clicks' => 'integer',
    ];

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->orderBy('date', 'ASC');
    }
}