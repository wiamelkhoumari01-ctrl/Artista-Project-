<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        $middleware->alias([
            'role'      => \App\Http\Middleware\CheckRole::class,
            'admin'     => \App\Http\Middleware\AdminMiddleware::class,
            'setLocale' => \App\Http\Middleware\SetLocale::class,
        ]);

        $middleware->statefulApi();

        $middleware->appendToGroup('api', [
            \Illuminate\Session\Middleware\StartSession::class,
            \App\Http\Middleware\SetLocale::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {

        
        $exceptions->render(function (AuthenticationException $e, $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'message' => 'Non authentifié. Veuillez vous connecter.',
                ], 401);
            }
        });

    })->create();