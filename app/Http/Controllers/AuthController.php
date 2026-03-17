<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\Registered;
use App\Mail\ContactMessage;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * INSCRIPTION
     */
    public function inscription(Request $request) {
        // 1. On vérifie les données qui arrivent de React
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|confirmed|min:8',
            'role'       => 'required|in:utilisateur,artiste',
            'locale'     => 'nullable|string' // Le code langue (ex: 'fr')
        ]);

        // 2. On cherche l'ID de la langue dans ta table 'languages'
        // Si on ne trouve pas, on prend la langue par défaut (is_default = true)
        $language = Language::where('code', $request->locale)->first();
        if (!$language) {
            $language = Language::where('is_default', true)->first();
        }

        // 3. On crée l'utilisateur dans la base de données
        $user = User::create([
            'email'       => $data['email'],
            'password'    => Hash::make($data['password']),
            'role'        => $data['role'],
            'language_id' => $language ? $language->id : null, // Ajout du language_id ici
            // Note: les champs first_name/last_name devront être gérés 
            // selon si tu les as mis dans 'users' ou 'artist_translations'
        ]);

        // 4. On déclenche l'événement qui envoie le mail de confirmation Gmail
        event(new Registered($user));

        return response()->json([
            'success' => true,
            'message' => 'Compte créé avec succès ! Vérifiez votre boîte Gmail.'
        ], 201);
    }

    /**
     * CONNEXION
     */
    public function login(Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // On tente de connecter l'utilisateur
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false, 
                'message' => 'Email ou mot de passe incorrect.'
            ], 401);
        }

        // Si réussi, on récupère les infos de l'utilisateur
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'user' => $user,
            'message' => 'Heureux de vous revoir !'
        ]);
    }
   public function resetPassword(Request $request) {
    // 1. Validation stricte
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed', 
    ]);

    // 2. Vérification manuelle du token dans la table
    $record = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->where('token', $request->token)
        ->first();

    if (!$record) {
        return response()->json(['message' => 'Le lien est invalide ou a déjà été utilisé.'], 400);
    }

    // 3. Vérification si le token n'est pas trop vieux (Optionnel mais pro : 60 minutes)
    $createdAt = \Illuminate\Support\Carbon::parse($record->created_at);
    if ($createdAt->addMinutes(60)->isPast()) {
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        return response()->json(['message' => 'Le lien a expiré.'], 400);
    }

    // 4. Mise à jour de l'utilisateur
    $user = \App\Models\User::where('email', $request->email)->first();
    if (!$user) {
        return response()->json(['message' => 'Utilisateur introuvable.'], 404);
    }

    $user->update([
        'password' => \Illuminate\Support\Facades\Hash::make($request->password)
    ]);

    // 5. Nettoyage : On supprime le token pour qu'il ne serve plus
    \Illuminate\Support\Facades\DB::table('password_reset_tokens')->where('email', $request->email)->delete();

    return response()->json(['success' => true, 'message' => 'Votre mot de passe a été modifié avec succès !']);
}
    /**
     * MOT DE PASSE OUBLIÉ
     */
    public function forgotPassword(Request $request) {
    $request->validate(['email' => 'required|email']);
    $user = \App\Models\User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'Email non reconnu.'], 404);
    }

    // 1. On crée le token nous-mêmes pour être sûrs de ce qu'on fait
    $token = \Illuminate\Support\Str::random(64);
    \Illuminate\Support\Facades\DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => $request->email],
        ['token' => $token, 'created_at' => now()]
    );

    // 2. On définit l'URL qui pointe vers ton REACT (5173)
    $url = "http://localhost:5173/reset-password?token=$token&email=" . urlencode($request->email);

    // 3. On envoie avec la méthode que tu maîtrises déjà
    try {
        \Illuminate\Support\Facades\Mail::send([], [], function ($message) use ($request, $url) {
            $message->to($request->email)
                ->subject('Réinitialisation de mot de passe - Artista')
                ->html("<h3>Bonjour,</h3><p>Cliquez ici pour changer votre mot de passe :</p><a href='$url'>$url</a>");
        });
        return response()->json(['success' => true, 'message' => 'Lien envoyé sur votre Gmail !']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => 'Erreur SMTP.'], 500);
    }
}

    /**
     * DÉCONNEXION
     */
    public function logout(Request $request) {
    // On supprime le token actuel de l'utilisateur
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Déconnexion réussie'
    ]);
}
    
    public function getArtistProfile(Request $request) {
    $user = $request->user();

    // On récupère les données de la table 'artists' liées à l'utilisateur
    // avec les traductions (selon ta structure de base de données)
    $artist = \App\Models\Artist::where('user_id', $user->id)
                ->with(['translations' => function($query) {
                    $query->where('locale', app()->getLocale());
                }])
                ->first();

    if (!$artist) {
        return response()->json(['message' => 'Profil non trouvé'], 404);
    }

    return response()->json([
        'image_url' => $artist->image_url,
        'city' => $artist->city,
        'country' => $artist->country,
        'website' => $artist->website,
        'stage_name' => $artist->translations->first()->stage_name ?? '',
        'bio' => $artist->translations->first()->bio ?? '',
    ]);
}
}