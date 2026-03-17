<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Vérifier si l'utilisateur est connecté
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // 2. Vérifier si son rôle est dans la liste autorisée
        if (!in_array($request->user()->role, $roles)) {
            return response()->json(['message' => 'Accès interdit : rôle insuffisant'], 403);
        }

        return $next($request);
    }
}