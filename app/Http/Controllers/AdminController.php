<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Artist;
use App\Models\Artwork;
use App\Models\Event;
use App\Models\Category;
use App\Models\ArtistStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getStats()
    {
        return response()->json([
            'total_artists'  => User::where('role', 'artiste')->count(),
            'total_artworks' => Artwork::count(),
            'total_events'   => Event::count(),
            'total_users'    => User::where('role', 'utilisateur')->count(),
        ]);
    }

    /**
     * KPIs — données pour les 3 graphiques
     */
    public function getKpis()
    {
        // 1. Vues par artiste (top 10)
        $viewsByArtist = Artist::with('user')
            ->orderByDesc('views_count')
            ->take(10)
            ->get()
            ->map(function ($artist) {
                $name = $artist->stage_name;
                $label = is_array($name)
                    ? ($name['fr'] ?? $name['en'] ?? 'Artiste')
                    : ($name ?? 'Artiste');
                return [
                    'name'   => $label,
                    'views'  => (int) ($artist->views_count  ?? 0),
                    'clicks' => (int) ($artist->clicks_count ?? 0),
                ];
            });

        // 2. Œuvres par catégorie
        $artworksByCategory = Category::withCount('artworks')->get()->map(function ($cat) {
            $name = $cat->name;
            return [
                'name'  => is_array($name) ? ($name['fr'] ?? 'Catégorie') : ($name ?? 'Catégorie'),
                'total' => $cat->artworks_count,
            ];
        })->filter(fn($c) => $c['total'] > 0)->values();

        // 3. Inscriptions par jour (30 derniers jours)
        $registrations = User::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total')
            )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get()
            ->map(function ($r) {
                return [
                    'date'  => $r->date,
                    'total' => (int) $r->total,
                ];
            });

        return response()->json([
            'views_by_artist'     => $viewsByArtist,
            'artworks_by_category'=> $artworksByCategory,
            'registrations'       => $registrations,
        ]);
    }

    public function getArtists(Request $request)
    {
        $locale = $request->query('lang', 'fr');
        $users  = User::where('role', 'artiste')->with(['artist.category'])->get();

        return response()->json($users->map(function ($user) use ($locale) {
            $artist    = $user->artist;
            $stageName = '';
            if ($artist) {
                $sn = $artist->stage_name;
                $stageName = is_array($sn) ? ($sn[$locale] ?? $sn['fr'] ?? '') : ($sn ?? '');
            }
            return [
                'id'    => $user->id,
                'email' => $user->email,
                'artist' => $artist ? [
                    'phone'   => $artist->phone,
                    'country' => $artist->country,
                    'artist_translations' => [[
                        'first_name' => $user->first_name,
                        'last_name'  => $user->last_name,
                        'stage_name' => $stageName,
                    ]],
                ] : null,
            ];
        }));
    }

    public function getArtworks(Request $request)
    {
        $locale   = $request->query('lang', 'fr');
        $artworks = Artwork::with(['artist', 'category'])->get();

        return response()->json($artworks->map(function ($art) use ($locale) {
            $title = is_array($art->title)
                ? ($art->title[$locale] ?? $art->title['fr'] ?? 'Sans titre')
                : ($art->title ?? 'Sans titre');

            $desc = is_array($art->description)
                ? ($art->description[$locale] ?? $art->description['fr'] ?? '')
                : ($art->description ?? '');

            $catName = null;
            if ($art->category && is_array($art->category->name)) {
                $catName = $art->category->name[$locale] ?? $art->category->name['fr'] ?? null;
            }

            $artistName = null;
            if ($art->artist && is_array($art->artist->stage_name)) {
                $artistName = $art->artist->stage_name[$locale]
                    ?? $art->artist->stage_name['fr']
                    ?? 'Inconnu';
            }

            return [
                'id'          => $art->id,
                'image_url'   => $art->image_url,
                'category_id' => $art->category_id,
                'date_creation'=> $art->date_creation,
                'artwork_translations' => [[
                    'title'       => $title,
                    'description' => $desc,
                ]],
                'category' => $art->category ? [
                    'id'   => $art->category->id,
                    'name' => $catName ?? '-',
                    'category_translations' => [['name' => $catName ?? '-']],
                ] : null,
                'artist' => $art->artist ? [
                    'artist_translations' => [['stage_name' => $artistName ?? 'Inconnu']],
                ] : null,
            ];
        }));
    }

    public function getEvents(Request $request)
    {
        $locale = $request->query('lang', 'fr');
        $events = Event::with('artists')->get();

        return response()->json($events->map(function ($event) use ($locale) {
            $title = is_array($event->title)
                ? ($event->title[$locale] ?? $event->title['fr'] ?? 'Sans titre')
                : ($event->title ?? 'Sans titre');

            $desc = is_array($event->description)
                ? ($event->description[$locale] ?? $event->description['fr'] ?? '')
                : ($event->description ?? '');

            return [
                'id'           => $event->id,
                'type'         => $event->type,
                'venue_name'   => $event->venue_name,
                'start_date'   => $event->start_date,
                'end_date'     => $event->end_date,
                'location_url' => $event->location_url,
                'event_translations' => [[
                    'title'       => $title,
                    'description' => $desc,
                ]],
            ];
        }));
    }

    public function updateArtist(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $request->validate([
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'email'      => 'required|email|unique:users,email,' . $id,
            'phone'      => 'nullable|string',
            'country'    => 'nullable|string',
        ]);
        DB::transaction(function () use ($user, $request) {
            $user->update([
                'first_name' => $request->first_name,
                'last_name'  => $request->last_name,
                'email'      => $request->email,
            ]);
            if ($user->artist) {
                $user->artist()->update([
                    'phone'   => $request->phone,
                    'country' => $request->country,
                ]);
            }
        });
        return response()->json(['message' => 'Artiste mis à jour']);
    }

    public function deleteArtist($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'Artiste supprimé']);
    }

    public function updateArtwork(Request $request, $id)
    {
        $artwork = Artwork::findOrFail($id);
        $request->validate([
            'title'       => 'required|array',
            'description' => 'nullable|array',
            'category_id' => 'nullable|exists:categories,id',
        ]);
        $artwork->update([
            'title'         => $request->title,
            'description'   => $request->description ?? $artwork->description,
            'category_id'   => $request->category_id ?? $artwork->category_id,
            'date_creation' => $request->date_creation ?? $artwork->date_creation,
        ]);
        return response()->json(['message' => 'Œuvre modifiée']);
    }

    public function deleteArtwork($id)
    {
        Artwork::findOrFail($id)->delete();
        return response()->json(['message' => 'Œuvre supprimée']);
    }

    public function storeEvent(Request $request)
    {
        $request->validate([
            'title'      => 'required|array',
            'venue_name' => 'required|string',
            'start_date' => 'required|date',
            'end_date'   => 'required|date',
            'type'       => 'required|string',
        ]);
        Event::create([
            'title'        => $request->title,
            'description'  => $request->description ?? [],
            'venue_name'   => $request->venue_name,
            'start_date'   => $request->start_date,
            'end_date'     => $request->end_date,
            'type'         => $request->type,
            'location_url' => $request->location_url,
        ]);
        return response()->json(['message' => 'Événement créé']);
    }

    public function updateEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $request->validate([
            'title'      => 'required|array',
            'start_date' => 'required|date',
            'end_date'   => 'required|date',
        ]);
        $event->update([
            'title'        => $request->title,
            'description'  => $request->description ?? [],
            'venue_name'   => $request->venue_name,
            'start_date'   => $request->start_date,
            'end_date'     => $request->end_date,
            'type'         => $request->type,
            'location_url' => $request->location_url,
        ]);
        return response()->json(['message' => 'Événement mis à jour']);
    }

    public function deleteEvent($id)
    {
        Event::findOrFail($id)->delete();
        return response()->json(['message' => 'Événement supprimé']);
    }
}