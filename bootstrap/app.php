<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // On s'assure que l'API est bien chargée
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // On configure le CORS pour autoriser ton React (souvent localhost:5173 ou 3000)
        // Cela remplace le besoin d'un fichier config/cors.php séparé
        $middleware->validateCsrfTokens(except: [
            'api/*', // On dit à Laravel : "N'exige PAS de jeton CSRF pour les routes API"
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
        
        // Active Sanctum pour protéger les routes API si besoin
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();