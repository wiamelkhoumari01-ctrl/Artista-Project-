<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArtistController extends Controller
{
    public function index(Request $request)
    {
        $lang = $request->query('lang', 'fr');
        $artists = Artist::with([
            'artist_translations' => function($query) use ($lang) { $query->where('locale', $lang); },
            'category.category_translations' => function($query) use ($lang) { $query->where('locale', $lang); }
        ])->get();
        return response()->json($artists);
    }

    public function show($slug, Request $request)
    {
        $lang = $request->query('lang', 'fr');
        $artist = Artist::whereHas('artist_translations', function($query) use ($slug) { $query->where('slug', $slug); })
        ->with([
            'artist_translations' => function($q) use ($lang) { $q->where('locale', $lang); },
            'category.category_translations' => function($q) use ($lang) { $q->where('locale', $lang); },
            'artworks.artwork_translations' => function($q) use ($lang) { $q->where('locale', $lang); },
            'events.event_translations' => function($q) use ($lang) { $q->where('locale', $lang); }
        ])->first();

        if (!$artist) return response()->json(['message' => 'Artiste non trouvé'], 404);
        return response()->json($artist);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $lang = $request->input('locale', 'fr');
        $artist = $user->artist()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'category_id' => $request->category_id,
                'city' => $request->city,
                'country' => $request->country,
                'website' => $request->website,
                'phone' => $request->phone,
                'image_url' => $request->image_url,
            ]
        );

        $artist->artist_translations()->updateOrCreate(
            ['locale' => $lang, 'artist_id' => $artist->id],
            [
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'stage_name' => $request->stage_name,
                'bio' => $request->bio,
                'slug' => Str::slug($request->stage_name),
            ]
        );
        return response()->json(['message' => 'Profil mis à jour']);
    }

    public function getStats(Request $request)
    {
        $artist = $request->user()->artist;
        $stats = \App\Models\ArtistStat::where('artist_id', $artist->id)
            ->where('date', '>=', now()->subDays(30))
            ->orderBy('date', 'ASC')
            ->get(['date', 'views']);

        return response()->json([
            'total_views' => $artist->views_count,
            'total_clicks' => $artist->clicks_count,
            'chart_data' => $stats
        ]);
    }
}