<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArtWorkController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\EventController;
use App\Models\Category;
use Illuminate\Http\Request;

// ── Routes publiques ──────────────────────────────────────────────────
Route::post('/login',           [AuthController::class, 'login']);
Route::post('/inscription',     [AuthController::class, 'inscription']);
Route::post('/google-auth',     [AuthController::class, 'googleAuth']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password',  [AuthController::class, 'resetPassword']);
Route::post('/contact',         [ContactController::class, 'contact']);

Route::get('/artists',          [ArtistController::class, 'index']);
Route::get('/artists/{slug}',   [ArtistController::class, 'show']);
Route::get('/events',           [EventController::class,  'index']);
Route::get('/event-locations',  [EventController::class,  'getLocations']);

// Liste des artistes pour le select filtre — avec locale
Route::get('/artists-list',     [ArtistController::class, 'getArtistsList']);

// Catégories publiques
Route::get('/categories', function () {
    return response()->json(Category::all());
});

// ── Routes protégées ──────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // ── Artiste + Admin ────────────────────────────────────────────────
    Route::middleware('role:artiste,admin')->group(function () {
        Route::get('/artist-profile',          [ArtWorkController::class, 'getArtistProfile']);
        Route::post('/artist/update',          [ArtistController::class,  'updateProfile']);
        Route::post('/artist/upload-photo',    [ArtistController::class,  'uploadPhoto']);
        Route::post('/artist/set-locale',      function (Request $request) {
            $request->user()->update(['locale' => $request->locale]);
            return response()->json(['ok' => true]);
        });

        Route::get('/artworks',              [ArtWorkController::class, 'getMyArtworks']);
        Route::post('/artworks/store',       [ArtWorkController::class, 'store']);
        Route::delete('/artworks/{id}',      [ArtWorkController::class, 'destroy']);
        Route::put('/artworks/{id}',         [ArtWorkController::class, 'update']);

        Route::get('/artist/stats',          [ArtistController::class, 'getStats']);
        Route::get('/artist/events',         [ArtistController::class, 'getMyEvents']);
        Route::post('/artist/events/store',  [ArtistController::class, 'storeEvent']);
        Route::delete('/artist/events/{id}', [ArtistController::class, 'deleteEvent']);
        Route::put('/artist/events/{id}',    [ArtistController::class,  'updateEvent']);
    });

    // ── Admin uniquement ───────────────────────────────────────────────
    Route::middleware('admin')->group(function () {
        Route::get('/admin/stats',            [AdminController::class, 'getStats']);
        Route::get('/admin/artists',          [AdminController::class, 'getArtists']);
        Route::put('/admin/artists/{id}',     [AdminController::class, 'updateArtist']);
        Route::delete('/admin/artists/{id}',  [AdminController::class, 'deleteArtist']);
        Route::get('/admin/artworks',         [AdminController::class, 'getArtworks']);
        Route::put('/admin/artworks/{id}',    [AdminController::class, 'updateArtwork']);
        Route::delete('/admin/artworks/{id}', [AdminController::class, 'deleteArtwork']);
        Route::get('/admin/events',           [AdminController::class, 'getEvents']);
        Route::post('/admin/events',          [AdminController::class, 'storeEvent']);
        Route::put('/admin/events/{id}',      [AdminController::class, 'updateEvent']);
        Route::delete('/admin/events/{id}',   [AdminController::class, 'deleteEvent']);
        Route::get('/admin/kpis', [AdminController::class, 'getKpis']);
    });
});