<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    /**
     * Gère la langue de l'application selon le Header envoyé par React.
     */
    public function handle(Request $request, Closure $next)
    {
        // On récupère le header (X-App-Locale défini dans ton api.js)
        $locale = $request->header('X-App-Locale', 'fr');

        // On vérifie que la langue fait partie de tes langues autorisées
        if (in_array($locale, ['fr', 'en', 'ar'])) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}