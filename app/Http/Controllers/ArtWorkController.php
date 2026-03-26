<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Artist;
use App\Models\Artwork;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ArtWorkController extends Controller
{
    public function getMyArtworks(Request $request)
    {
        $user = $request->user();
        $artist = Artist::where('user_id', $user->id)->first();
        if (!$artist) return response()->json([], 404);

        $artworks = Artwork::where('artist_id', $artist->id)
            ->with(['translations' => function ($q) {
                $q->where('locale', app()->getLocale());
            }])
            ->get()
            ->map(function ($art) {
                return [
                    'id' => $art->id,
                    'image_url' => $art->image_url,
                    'date_creation' => $art->date_creation,
                    'title' => $art->translations->first()->title ?? 'Sans titre',
                ];
            });

        return response()->json($artworks);
    }

    public function getArtistProfile(Request $request)
    {
        $user = $request->user();
        $artist = Artist::where('user_id', $user->id)
            ->with(['translations' => function ($query) {
                $query->where('locale', app()->getLocale());
            }])
            ->first();

        if (!$artist) return response()->json(['message' => 'Profil artiste non trouvé.'], 404);

        $translation = $artist->translations->first();
        return response()->json([
            'id' => $artist->id,
            'image_url' => $artist->image_url,
            'phone' => $artist->phone,
            'country' => $artist->country,
            'city' => $artist->city,
            'website' => $artist->website,
            'stage_name' => $translation->stage_name ?? '',
            'bio' => $translation->bio ?? '',
            'first_name' => $translation->first_name ?? '',
            'last_name' => $translation->last_name ?? '',
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'title' => 'required|string|max:255',
            'locale' => 'required|string|size:2'
        ]);

        $user = $request->user();
        $artist = Artist::where('user_id', $user->id)->firstOrFail();

        $artwork = Artwork::create([
            'artist_id' => $artist->id,
            'category_id' => $request->category_id ?? 1,
            'image_url' => '',
            'date_creation' => $request->date_creation ?? now(),
        ]);

        $artwork->translations()->create([
            'locale' => $request->locale,
            'title' => $request->title,
            'description' => $request->description,
        ]);

        if ($request->hasFile('images')) {
            $manager = new ImageManager(new Driver());
            foreach ($request->file('images') as $index => $file) {
                $filename = time() . '_' . $index . '.webp';
                $path = 'artworks/' . $filename;
                $image = $manager->read($file);
                $image->scale(width: 1200);
                $encoded = $image->toWebp(80);
                Storage::disk('public')->put($path, (string) $encoded);

                $artwork->artwork_images()->create([
                    'path' => $path,
                    'is_main' => $index === 0
                ]);

                if ($index === 0) $artwork->update(['image_url' => $path]);
            }
        }
        return response()->json(['message' => 'Œuvre ajoutée'], 201);
    }

    public function destroy($id, Request $request)
    {
        $user = $request->user();
        $artwork = Artwork::with('artwork_images')->findOrFail($id);
        $artist = Artist::where('user_id', $user->id)->first();
        if ($artwork->artist_id !== $artist->id) return response()->json(['message' => 'Non autorisé'], 403);

        foreach ($artwork->artwork_images as $img) {
            Storage::disk('public')->delete($img->path);
        }
        $artwork->delete();
        return response()->json(['message' => 'Œuvre supprimée']);
    }
}