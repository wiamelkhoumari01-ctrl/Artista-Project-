<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next,string ...$roles): Response
    {
        // Récupère l'utilisateur via le token Bearer explicitement
        $user = $request->user('sanctum');

        // Fallback sur l'utilisateur de la requête si pas de token Bearer
        if (!$user) {
            $user = $request->user();
        }

        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Recharge le rôle depuis la BDD pour éviter le cache session
        $user->refresh();

        if (!in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Accès interdit : rôle insuffisant',
                'role_actuel' => $user->role,
                'roles_requis' => $roles,
            ], 403);
        }

        return $next($request);
    }
}