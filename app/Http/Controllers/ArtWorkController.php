<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Artist;  


class ArtWorkController extends Controller
{
     public function getMyArtworks(Request $request) {
    $user = $request->user();
    
    // On cherche l'artiste lié à l'utilisateur
    $artist = \App\Models\Artist::where('user_id', $user->id)->first();

    if (!$artist) return response()->json([], 404);

    // On récupère ses œuvres avec leurs titres traduits
    $artworks = \App\Models\Artwork::where('artist_id', $artist->id)
        ->with(['translations' => function($q) {
            $q->where('locale', app()->getLocale());
        }])
        ->get()
        ->map(function($art) {
            return [
                'id' => $art->id,
                'image_url' => $art->image_url,
                'date_creation' => $art->date_creation,
                'title' => $art->translations->first()->title ?? 'Sans titre',
            ];
        });

    return response()->json($artworks);
    
}
public function getArtistProfile(Request $request) {
        $user = $request->user();

        // On cherche l'artiste lié à l'utilisateur connecté
        // On charge la relation 'translations' pour avoir la bio et le pseudo
        $artist = Artist::where('user_id', $user->id)
                    ->with(['translations' => function($query) {
                        // On peut filtrer par la langue actuelle de l'app si besoin
                        $query->where('locale', app()->getLocale());
                    }])
                    ->first();

        if (!$artist) {
            return response()->json(['message' => 'Profil artiste non trouvé pour cet utilisateur.'], 404);
        }

        // On récupère la première traduction disponible
        $translation = $artist->translations->first();

        return response()->json([
            'id'         => $artist->id,
            'image_url'  => $artist->image_url,
            'phone'      => $artist->phone,
            'country'    => $artist->country,
            'city'       => $artist->city,
            'website'    => $artist->website,
            'stage_name' => $translation->stage_name ?? '', // Pseudo
            'bio'        => $translation->bio ?? '',        // Présentation
            'first_name' => $translation->first_name ?? '',
            'last_name'  => $translation->last_name ?? '',
        ]);
    }
}
