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
        $artist = $request->user()->artist;
        if (!$artist) return response()->json([], 404);

        $artworks = Artwork::where('artist_id', $artist->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($art) {
                $art->image_url = $this->resolveImageUrl($art->image_url);
                return $art;
            });

        return response()->json($artworks);
    }

    public function getArtistProfile(Request $request)
    {
        $user   = $request->user();
        $artist = Artist::where('user_id', $user->id)->with('category')->first();

        if (!$artist) return response()->json(['message' => 'Profil non trouvé'], 404);

        // Résout l'URL image pour affichage immédiat dans Profile.jsx
        $artistArray = $artist->toArray();
        $artistArray['image_url'] = $this->resolveImageUrl($artist->image_url);

        return response()->json($artistArray);
    }

    public function store(Request $request)
    {
        $request->validate([
            'images'        => 'required|array|min:1',
            'images.*'      => 'required|file|image|mimes:jpeg,png,jpg,webp|max:5120',
            'title'         => 'required|array',
            'title.fr'      => 'required|string',
            'description'   => 'nullable|array',
            'category_id'   => 'required|exists:categories,id',
            'date_creation' => 'nullable|date',
        ]);

        $user   = $request->user();
        $artist = $user->artist()->firstOrFail();
        $folder = 'artistes/' . $artist->slug;

        $artwork = Artwork::create([
            'artist_id'     => $artist->id,
            'category_id'   => $request->category_id,
            'title'         => $request->title,
            'description'   => $request->description ?? [],
            'image_url'     => '',
            'date_creation' => $request->date_creation ?? now()->format('Y-m-d'),
        ]);

        $manager = new ImageManager(new Driver());

        foreach ($request->file('images') as $index => $file) {
            $filename = 'oeuvre_' . $artwork->id . '_' . time() . '_' . $index . '.webp';
            $path     = $folder . '/' . $filename;

            $encoded = $manager->read($file)->scale(width: 1200)->toWebp(80);
            Storage::disk('public')->put($path, (string) $encoded);

            $artwork->images()->create([
                'path'    => $path,
                'is_main' => $index === 0,
            ]);

            if ($index === 0) {
                $artwork->update(['image_url' => $path]);
            }
        }

        return response()->json([
            'message' => 'Œuvre ajoutée avec succès',
            'artwork' => $artwork,
        ], 201);
    }

    public function update(Request $request, $id)
{
    $artist  = $request->user()->artist;
    $artwork = Artwork::findOrFail($id);

    if ($artwork->artist_id !== $artist->id) {
        return response()->json(['message' => 'Non autorisé'], 403);
    }

    $request->validate([
        'title'         => 'required|array',
        'description'   => 'nullable|array',
        'category_id'   => 'nullable|exists:categories,id',
        'date_creation' => 'nullable|date',
    ]);

    $artwork->update([
        'title'         => $request->title,
        'description'   => $request->description ?? $artwork->description,
        'category_id'   => $request->category_id  ?? $artwork->category_id,
        'date_creation' => $request->date_creation ?? $artwork->date_creation,
    ]);

    return response()->json(['message' => 'Œuvre modifiée', 'artwork' => $artwork]);
}

    public function destroy($id, Request $request)
    {
        $artist  = $request->user()->artist;
        $artwork = Artwork::with('images')->findOrFail($id);

        if ($artwork->artist_id !== $artist->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        foreach ($artwork->images as $img) {
            Storage::disk('public')->delete($img->path);
        }
        if ($artwork->image_url && !str_starts_with($artwork->image_url, '/images/')) {
            Storage::disk('public')->delete($artwork->image_url);
        }

        $artwork->delete();
        return response()->json(['message' => 'Œuvre supprimée']);
    }

    private function resolveImageUrl(?string $path): ?string
    {
        if (!$path) return null;
        if (str_starts_with($path, '/images/')) return $path;
        if (str_starts_with($path, 'http'))     return $path;
        return asset('storage/' . $path);
    }
}