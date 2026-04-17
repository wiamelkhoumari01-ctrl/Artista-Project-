<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use App\Models\ArtistStat;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ArtistController extends Controller
{
    public function index(Request $request)
    {
        $locale  = $request->query('lang', 'fr');
        $artists = Artist::with(['category', 'user'])->get();
        return response()->json($artists->map(fn($a) => $this->formatArtist($a, $locale)));
    }

    public function getArtistsList(Request $request)
    {
        $locale  = strtolower($request->query('locale', 'fr'));
        $artists = Artist::select('id', 'stage_name')->get();

        return response()->json($artists->map(function ($artist) use ($locale) {
            $name = $artist->stage_name;
            if (is_array($name)) {
                $resolved = $name[$locale] ?? $name['fr'] ?? $name['en'] ?? 'Artiste';
            } else {
                $resolved = $name ?? 'Artiste';
            }
            return [
                'id'         => $artist->id,
                'stage_name' => $resolved,
            ];
        }));
    }

    /**
     * Détail artiste — incrémente les vues à chaque consultation
     */
    public function show(Request $request, $slug)
    {
        $locale = $request->query('lang', 'fr');
        $artist = Artist::where('slug', $slug)
            ->with(['category', 'artworks', 'events'])
            ->first();

        if (!$artist) return response()->json(['message' => 'Artiste non trouvé'], 404);

        // ── Incrémente views_count global ──────────────────────────────
        DB::table('artists')
            ->where('id', $artist->id)
            ->increment('views_count');

        // ── Enregistre/incrémente dans artist_stats ────────────────────
        $today = now()->format('Y-m-d');

        // Vérifie si une entrée existe pour aujourd'hui
        $existing = DB::table('artist_stats')
            ->where('artist_id', $artist->id)
            ->where('date', $today)
            ->first();

        if ($existing) {
            // Incrémente la vue du jour
            DB::table('artist_stats')
                ->where('id', $existing->id)
                ->increment('views');
        } else {
            // Crée une nouvelle entrée pour aujourd'hui
            DB::table('artist_stats')->insert([
                'artist_id' => $artist->id,
                'date'      => $today,
                'views'     => 1,
                'clicks'    => 0,
            ]);
        }
        // ──────────────────────────────────────────────────────────────

        // Refresh pour avoir views_count à jour
        $artist->refresh();

        return response()->json([
            'id'        => $artist->id,
            'slug'      => $artist->slug,
            'city'      => $artist->city,
            'country'   => $artist->country,
            'website'   => $artist->website,
            'image_url' => $this->resolveImageUrl($artist->image_url),
            'artist_translations' => [[
                'stage_name' => $this->fromJson($artist->stage_name, $locale),
                'bio'        => $this->fromJson($artist->bio, $locale),
                'slug'       => $artist->slug,
            ]],
            'artworks' => $artist->artworks->map(function ($art) use ($locale) {
                return [
                    'id'        => $art->id,
                    'image_url' => $this->resolveImageUrl($art->image_url),
                    'artwork_translations' => [[
                        'title'       => $this->fromJson($art->title, $locale),
                        'description' => $this->fromJson($art->description, $locale),
                    ]],
                ];
            }),
            'events' => $artist->events->map(function ($ev) use ($locale) {
                return [
                    'id'         => $ev->id,
                    'start_date' => $ev->start_date,
                    'event_translations' => [[
                        'title'       => $this->fromJson($ev->title, $locale),
                        'venue_name'  => $ev->venue_name,
                        'description' => $this->fromJson($ev->description, $locale),
                    ]],
                ];
            }),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'stage_name'  => 'nullable|array',
            'bio'         => 'nullable|array',
            'specialite'  => 'nullable|array',
            'category_id' => 'nullable|exists:categories,id',
            'city'        => 'nullable|string|max:100',
            'country'     => 'nullable|string|max:100',
            'phone'       => 'nullable|string|max:30',
            'website'     => 'nullable|string|max:255',
        ]);

        $existingArtist = $user->artist;
        $stageName      = $request->stage_name;

        if (!$existingArtist) {
            $base = $stageName ? ($stageName['fr'] ?? $user->first_name) : $user->first_name;
            $slug = Str::slug($base) . '-' . Str::lower(Str::random(4));
        } else {
            $slug = $existingArtist->slug;
        }

        $data = ['slug' => $slug];
        if ($request->has('stage_name'))  $data['stage_name']  = $stageName;
        if ($request->has('bio'))         $data['bio']          = $request->bio;
        if ($request->has('specialite'))  $data['specialite']   = $request->specialite;
        if ($request->has('category_id')) $data['category_id']  = $request->category_id;
        if ($request->has('city'))        $data['city']         = $request->city;
        if ($request->has('country'))     $data['country']      = $request->country;
        if ($request->has('phone'))       $data['phone']        = $request->phone;
        if ($request->has('website'))     $data['website']      = $request->website;

        $artist = Artist::updateOrCreate(['user_id' => $user->id], $data);

        return response()->json(['message' => 'Profil mis à jour', 'artist' => $artist]);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|file|image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);

        $user   = $request->user();
        $artist = $user->artist;

        if (!$artist) return response()->json(['message' => 'Profil artiste inexistant'], 404);

        if ($artist->image_url && !str_starts_with($artist->image_url, '/images/')) {
            Storage::disk('public')->delete($artist->image_url);
        }

        $manager  = new ImageManager(new Driver());
        $folder   = 'artistes/' . $artist->slug;
        $filename = 'profil_' . time() . '.webp';
        $path     = $folder . '/' . $filename;

        $encoded = $manager->read($request->file('photo'))
            ->cover(500, 500)
            ->toWebp(85);

        Storage::disk('public')->put($path, (string) $encoded);
        $artist->update(['image_url' => $path]);

        return response()->json([
            'message'   => 'Photo mise à jour avec succès',
            'image_url' => asset('storage/' . $path),
        ]);
    }

    public function getMyEvents(Request $request)
    {
        $artist = $request->user()->artist;
        if (!$artist) return response()->json([], 200);
        return response()->json($artist->events()->orderBy('start_date', 'asc')->get());
    }

    public function storeEvent(Request $request)
    {
        $request->validate([
            'type'         => 'required|in:Exposition,Atelier,Concert,Festival',
            'title'        => 'required|array',
            'title.fr'     => 'required|string',
            'venue_name'   => 'required|string|max:255',
            'start_date'   => 'required|date',
            'end_date'     => 'required|date|after_or_equal:start_date',
            'description'  => 'nullable|array',
            'location_url' => 'nullable|string|max:500',
        ]);

        $artist = $request->user()->artist;
        if (!$artist) return response()->json(['message' => 'Profil artiste requis'], 403);

        $event = Event::create([
            'type'         => $request->type,
            'title'        => $request->title,
            'description'  => $request->description ?? [],
            'venue_name'   => $request->venue_name,
            'start_date'   => $request->start_date,
            'end_date'     => $request->end_date,
            'location_url' => $request->location_url,
        ]);

        $event->artists()->attach($artist->id);

        return response()->json(['message' => 'Événement créé', 'event' => $event], 201);
    }

    public function updateEvent(Request $request, $id)
    {
        $artist = $request->user()->artist;
        $event  = Event::findOrFail($id);

        if (!$event->artists()->where('artists.id', $artist->id)->exists()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'type'         => 'required|in:Exposition,Atelier,Concert,Festival',
            'title'        => 'required|array',
            'title.fr'     => 'required|string',
            'venue_name'   => 'required|string|max:255',
            'start_date'   => 'required|date',
            'end_date'     => 'required|date|after_or_equal:start_date',
            'description'  => 'nullable|array',
            'location_url' => 'nullable|string|max:500',
        ]);

        $event->update([
            'type'         => $request->type,
            'title'        => $request->title,
            'description'  => $request->description ?? [],
            'venue_name'   => $request->venue_name,
            'start_date'   => $request->start_date,
            'end_date'     => $request->end_date,
            'location_url' => $request->location_url,
        ]);

        return response()->json(['message' => 'Événement modifié', 'event' => $event]);
    }

    public function deleteEvent(Request $request, $id)
    {
        $artist = $request->user()->artist;
        $event  = Event::findOrFail($id);

        if (!$event->artists()->where('artists.id', $artist->id)->exists()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $event->artists()->detach($artist->id);
        if ($event->artists()->count() === 0) $event->delete();

        return response()->json(['message' => 'Événement supprimé']);
    }

    public function getStats(Request $request)
{
    $artist = $request->user()->artist;

    if (!$artist) {
        return response()->json([
            'total_views'  => 0,
            'chart_data'   => [],
        ]);
    }

    try {
        $freshArtist = DB::table('artists')
            ->where('id', $artist->id)
            ->select('views_count')
            ->first();

        return response()->json([
            'total_views' => (int) ($freshArtist->views_count ?? 0),
            'chart_data'  => [], // Plus utilisé mais gardé pour compatibilité
        ]);

    } catch (\Exception $e) {
        Log::error('getStats error: ' . $e->getMessage());
        return response()->json([
            'total_views' => 0,
            'chart_data'  => [],
        ]);
    }
}
    // ── Helpers ──────────────────────────────────────────────────────────

    private function resolveImageUrl(?string $path): ?string
    {
        if (!$path) return null;
        if (str_starts_with($path, '/images/')) return $path;
        if (str_starts_with($path, 'http'))     return $path;
        return asset('storage/' . $path);
    }

    private function fromJson($field, string $locale): string
    {
        if (!$field) return '';
        if (is_array($field)) return $field[$locale] ?? $field['fr'] ?? $field['en'] ?? '';
        return (string) $field;
    }

    private function formatArtist(Artist $artist, string $locale): array
    {
        $categoryName = null;
        if ($artist->category) {
            $n = $artist->category->name;
            $categoryName = is_array($n) ? ($n[$locale] ?? $n['fr'] ?? null) : $n;
        }

        return [
            'id'        => $artist->id,
            'slug'      => $artist->slug,
            'image_url' => $this->resolveImageUrl($artist->image_url),
            'city'      => $artist->city,
            'country'   => $artist->country,
            'artist_translations' => [[
                'stage_name' => $this->fromJson($artist->stage_name, $locale),
                'bio'        => $this->fromJson($artist->bio, $locale),
                'slug'       => $artist->slug,
            ]],
            'category' => $artist->category ? [
                'id' => $artist->category->id,
                'category_translations' => [[
                    'name' => $categoryName ?? 'Artiste',
                ]],
            ] : null,
        ];
    }
}