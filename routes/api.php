<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArtWorkController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\EventController;
use Illuminate\Http\Request;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/inscription', [AuthController::class, 'inscription']);
Route::post('/google-auth', [AuthController::class, 'googleAuth']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/contact', [ContactController::class, 'contact']);

Route::get('/artists', [ArtistController::class, 'index']);
Route::get('/artists/{slug}', [ArtistController::class, 'show']);
Route::get('/events', [EventController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user()->load(['artist.artist_translations']);
    });
    Route::get('/artist-profile', [ArtWorkController::class, 'getArtistProfile']);

    Route::middleware('role:artiste,admin')->group(function () {
        Route::get('/artworks', [ArtWorkController::class, 'getMyArtworks']);
        Route::post('/artworks/store', [ArtWorkController::class, 'store']);
        Route::delete('/artworks/{id}', [ArtWorkController::class, 'destroy']);
        Route::post('/artist/update', [ArtistController::class, 'updateProfile']);
        Route::get('/artist/stats', [ArtistController::class, 'getStats']);
    });

    Route::middleware('admin')->group(function () {
        Route::get('/admin/stats', [AdminController::class, 'getStats']);
        Route::get('/admin/artists', [AdminController::class, 'getArtists']);
        Route::put('/admin/artists/{id}', [AdminController::class, 'updateArtist']);
        Route::delete('/admin/artists/{id}', [AdminController::class, 'deleteArtist']);
        Route::get('/admin/artworks', [AdminController::class, 'getArtworks']);
        Route::get('/admin/events', [AdminController::class, 'getEvents']);
    });
});