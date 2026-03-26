<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryTranslation extends Model
{
    // Ajoute cette ligne pour désactiver les timestamps automatiques
    public $timestamps = false;

    protected $fillable = ['category_id', 'locale', 'name'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}