<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Artist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Google_Client;

class AuthController extends Controller
{
    // ── PLUS de "use HasApiTokens, Notifiable" ici ──

    public function inscription(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|confirmed|min:8',
            'role'       => 'required|in:utilisateur,artiste',
            'locale'     => 'nullable|string|max:5',
        ]);

        return DB::transaction(function () use ($data) {
            $user = User::create([
                'email'             => $data['email'],
                'password'          => Hash::make($data['password']),
                'role'              => $data['role'],
                'first_name'        => $data['first_name'],
                'last_name'         => $data['last_name'],
                'email_verified_at' => now(),
            ]);

            if ($data['role'] === 'artiste') {
                $this->createArtistProfile(
                    $user,
                    $data['first_name'],
                    $data['last_name'],
                    $data['locale'] ?? 'fr'
                );
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

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user  = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success'      => true,
                'access_token' => $token,
                'user'         => $this->formatUserResponse($user),
                'message'      => 'Heureux de vous revoir !',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Email ou mot de passe incorrect.',
        ], 401);
    }

    public function googleAuth(Request $request)
    {
        $request->validate([
            'token'  => 'required',
            'role'   => 'required|in:utilisateur,artiste',
            'locale' => 'nullable|string',
        ]);

        $client  = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($request->token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Token Google invalide',
            ], 401);
        }

        return DB::transaction(function () use ($payload, $request) {
            $email = $payload['email'];
            $user  = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'email'             => $email,
                    'password'          => Hash::make(Str::random(24)),
                    'role'              => $request->role,
                    'first_name'        => $payload['given_name']  ?? 'Prénom',
                    'last_name'         => $payload['family_name'] ?? 'Nom',
                    'email_verified_at' => now(),
                ]);

                if ($user->role === 'artiste') {
                    $this->createArtistProfile(
                        $user,
                        $user->first_name,
                        $user->last_name,
                        $request->locale ?? 'fr'
                    );
                }
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success'      => true,
                'access_token' => $token,
                'user'         => $this->formatUserResponse($user),
            ]);
        });
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => true,
                'message' => 'Si cet email existe, un nouveau mot de passe a été envoyé.',
            ]);
        }

        $newPassword = $this->generatePassword(8);

        $user->update(['password' => Hash::make($newPassword)]);
        $user->tokens()->delete();

        Mail::send([], [], function ($message) use ($user, $newPassword) {
            $message
                ->to($user->email, $user->first_name . ' ' . $user->last_name)
                ->subject('ARTISTA — Votre nouveau mot de passe')
                ->html($this->buildPasswordEmailHtml($user, $newPassword));
        });

        return response()->json([
            'success' => true,
            'message' => 'Un nouveau mot de passe a été envoyé à votre adresse email.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'Utilisez la fonction "Mot de passe oublié" pour recevoir un nouveau mot de passe.',
        ], 400);
    }

    // ── Helpers privés ────────────────────────────────────────────────

    private function generatePassword(int $length = 8): string
    {
        $uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        $lowercase = 'abcdefghjkmnpqrstuvwxyz';
        $numbers   = '23456789';
        $all       = $uppercase . $lowercase . $numbers;

        $password  = $uppercase[random_int(0, strlen($uppercase) - 1)];
        $password .= $lowercase[random_int(0, strlen($lowercase) - 1)];
        $password .= $numbers[random_int(0, strlen($numbers) - 1)];

        for ($i = 3; $i < $length; $i++) {
            $password .= $all[random_int(0, strlen($all) - 1)];
        }

        return str_shuffle($password);
    }

    private function buildPasswordEmailHtml(User $user, string $newPassword): string
    {
        $name  = htmlspecialchars($user->first_name . ' ' . $user->last_name);
        $email = htmlspecialchars($user->email);
        $year  = date('Y');

        return <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Nouveau mot de passe ARTISTA</title></head>
<body style="margin:0;padding:40px 20px;background:#ffffff;font-family:Arial,sans-serif;color:#333333;">
  <p style="font-size:13px;color:#999;margin:0 0 32px;">ARTISTA — Récupération de compte</p>
  <p style="font-size:15px;margin:0 0 12px;">Bonjour <strong>{$name}</strong>,</p>
  <p style="font-size:15px;line-height:1.6;margin:0 0 24px;color:#555;">
    Suite à votre demande de récupération pour <strong>{$email}</strong>,
    voici votre nouveau mot de passe temporaire :
  </p>
  <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#1a1a1a;
            font-family:'Courier New',monospace;margin:0 0 24px;padding:16px 0;
            border-top:1px solid #eee;border-bottom:1px solid #eee;text-align:center;">
    {$newPassword}
  </p>
  <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 32px;">
    Connectez-vous avec ce mot de passe puis modifiez-le depuis votre profil.
  </p>
  <p style="font-size:12px;color:#aaa;margin:0;">
    Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.<br>
    © {$year} ARTISTA. Tous droits réservés.
  </p>
</body>
</html>
HTML;
    }

    private function createArtistProfile($user, $firstName, $lastName, $locale)
    {
        $baseSlug = Str::slug($firstName . ' ' . $lastName);
        $slug     = $baseSlug . '-' . Str::lower(Str::random(5));

        Artist::create([
            'user_id'    => $user->id,
            'country'    => 'Maroc',
            'slug'       => $slug,
            'stage_name' => [$locale => $firstName . ' ' . $lastName],
            'bio'        => [$locale => ''],
        ]);
    }

    private function formatUserResponse($user)
    {
        return [
            'id'         => $user->id,
            'email'      => $user->email,
            'role'       => $user->role,
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'username'   => explode('@', $user->email)[0],
        ];
    }
}