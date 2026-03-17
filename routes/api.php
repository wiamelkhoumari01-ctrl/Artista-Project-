<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArtWorkController;
use App\Http\Controllers\ContactController;
use Illuminate\Http\Request;


// --- ROUTES PUBLIQUES (Tout le monde peut voir) ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/inscription', [AuthController::class, 'inscription']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/contact', [ContactController::class, 'contact']); // Ton formulaire de contact

// --- ROUTES PROTÉGÉES (Utilisateur doit être connecté) ---
Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    // Pour récupérer les infos spécifiques de l'artiste (bio, photo, etc.)
    Route::get('/artist-profile', [AuthController::class, 'getArtistProfile']);
//     // --- ZONE ARTISTE (Seulement les artistes) ---
    Route::middleware('role:artiste,admin')->group(function () {
        Route::post('/artworks', [ArtWorkController::class, 'getMyArtworks']); 
        //Seul un artiste ou admin peut ajouter une œuvre
    });

//     // --- ZONE ADMIN (Seulement l'admin) ---
//     Route::middleware('role:admin')->group(function () {
//         // Route::get('/admin/stats', [AdminController::class, 'stats']);
//     });
});


