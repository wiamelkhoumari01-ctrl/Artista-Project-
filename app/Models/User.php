<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Indispensable pour createToken()

class User extends Authenticatable 
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Les attributs assignables en masse.
     */
    protected $fillable = [
        'first_name', 'last_name',
        'email', 
        'password', 
        'role', // admin, artiste, utilisateur
        'email_verified_at', "locale",
    ];

    /**
     * Les attributs cachés pour les réponses API.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Typage automatique des colonnes (Casting).
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relation avec le profil d'artiste (uniquement si role === 'artiste').
     */
    public function artist() 
    {
        return $this->hasOne(Artist::class);
    }

    // --- HELPER METHODS (Utiles pour ton frontend React) ---

    /**
     * Vérifie si l'utilisateur est un administrateur.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Vérifie si l'utilisateur est un artiste.
     */
    public function isArtist(): bool
    {
        return $this->role === 'artiste';
    }
}