<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Artist;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Google_Client;

class AuthController extends Controller
{
    /**
     * INSCRIPTION CLASSIQUE
     */
    public function inscription(Request $request) {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|confirmed|min:8',
            'role'       => 'required|in:utilisateur,artiste',
            'locale'     => 'nullable|string|exists:languages,code'
        ]);

        // On cherche la langue ou celle par défaut
        $language = Language::where('code', $request->locale)->first() 
                    ?? Language::where('is_default', true)->first();

        return DB::transaction(function () use ($data, $language) {
            $user = User::create([
                'email'             => $data['email'],
                'password'          => Hash::make($data['password']),
                'role'              => $data['role'],
                'language_id'       => $language ? $language->id : null,
                'email_verified_at' => now(),
            ]);

            if ($data['role'] === 'artiste') {
                $this->createArtistProfile($user, $data['first_name'], $data['last_name'], $language->code ?? 'fr');
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success'      => true,
                'access_token' => $token,
                'user'         => $this->formatUserResponse($user),
                'message'      => 'Compte créé avec succès !'
            ], 201);
        });
    }

    /**
     * LOGIN
     */
    public function login(Request $request) {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success'      => true,
                'access_token' => $token,
                'user'         => $this->formatUserResponse($user),
                'message'      => 'Heureux de vous revoir !'
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Email ou mot de passe incorrect.'], 401);
    }

    /**
     * GOOGLE AUTH
     */
    public function googleAuth(Request $request) {
        $request->validate([
            'token' => 'required',
            'role'  => 'required|in:utilisateur,artiste',
            'locale' => 'nullable|string'
        ]);

        $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]); 
        $payload = $client->verifyIdToken($request->token);

        if (!$payload) {
            return response()->json(['success' => false, 'message' => 'Token Google invalide'], 401);
        }

        return DB::transaction(function () use ($payload, $request) {
            $email = $payload['email'];
            $user = User::where('email', $email)->first();

            if (!$user) {
                $language = Language::where('code', $request->locale)->first() 
                            ?? Language::where('is_default', true)->first();

                $user = User::create([
                    'email'             => $email,
                    'password'          => Hash::make(Str::random(24)),
                    'role'              => $request->role,
                    'language_id'       => $language->id ?? null,
                    'email_verified_at' => now(),
                ]);

                if ($user->role === 'artiste') {
                    $this->createArtistProfile(
                        $user, 
                        $payload['given_name'] ?? 'Prénom', 
                        $payload['family_name'] ?? 'Nom', 
                        $request->locale
                    );
                }
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success'      => true,
                'access_token' => $token,
                'user'         => $this->formatUserResponse($user)
            ]);
        });
    }

    /**
     * FONCTIONS PRIVÉES (Utilitaires)
     */
    private function createArtistProfile($user, $firstName, $lastName, $locale) {
        $artist = Artist::create([
            'user_id' => $user->id,
            'country' => 'Maroc', // Valeur par défaut
        ]);
        
        // Unicité du slug
        $baseSlug = Str::slug($firstName . ' ' . $lastName);
        $slug = $baseSlug . '-' . Str::lower(Str::random(5));

        $artist->artist_translations()->create([
            'locale'     => $locale ?? 'fr',
            'first_name' => $firstName,
            'last_name'  => $lastName,
            'slug'       => $slug,
        ]);
    }

    private function formatUserResponse($user) {
        return [
            'id'       => $user->id,
            'email'    => $user->email,
            'role'     => $user->role,
            'username' => explode('@', $user->email)[0]
        ];
    }

    // ... Garde tes autres méthodes (forgotPassword, logout, etc.) intactes
}