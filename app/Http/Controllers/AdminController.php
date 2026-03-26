<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Artist;
use App\Models\Artwork;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // --- STATISTIQUES ---
    public function getStats() {
        return response()->json([
            'total_artists' => User::where('role', 'artiste')->count(),
            'total_artworks' => Artwork::count(),
            'total_events' => Event::count(),
        ]);
    }

    // --- RÉCUPÉRATION DES DONNÉES (Pour les tableaux React) ---

    public function getArtists(Request $request) {
        $locale = $request->query('lang', 'fr');
        return response()->json(
            User::where('role', 'artiste')
                ->with(['artist.artist_translations' => fn($q) => $q->where('locale', $locale)])
                ->get()
        );
    }

public function getArtworks(Request $request) {
    $locale = $request->query('lang', 'fr');
    return response()->json(
        Artwork::with(['translations', 'artist.artist_translations', 'category.category_translations'])
        ->get()
        ->map(function($artwork) use ($locale) {
            // On force l'ajout d'un attribut "display_title" pour faciliter le travail de React
            $artwork->display_title = $artwork->translate($locale)?->title ?? $artwork->translate('fr')?->title ?? 'Sans titre';
            return $artwork;
        })
    );
}
    public function getEvents(Request $request) {
        $locale = $request->query('lang', 'fr');
        return response()->json(
            Event::with(['event_translations' => fn($q) => $q->where('locale', $locale)])
                ->get()
        );
    }

    // --- GESTION DES ARTISTES ---

    public function updateArtist(Request $request, $id) {
        $user = User::findOrFail($id);
        $locale = $request->input('locale', 'fr');

        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users,email,'.$id,
            'phone' => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        DB::transaction(function () use ($user, $request, $locale) {
            $user->update(['email' => $request->email]);

            $user->artist()->update([
                'phone' => $request->phone,
                'country' => $request->country,
            ]);

            $user->artist->artist_translations()->updateOrCreate(
                ['locale' => $locale],
                [
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                ]
            );
        });

        return response()->json(['message' => 'Artiste mis à jour avec succès']);
    }

    public function deleteArtist($id) {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'Artiste supprimé']);
    }

    // --- GESTION DES ŒUVRES ---

    public function updateArtwork(Request $request, $id) {
        $artwork = Artwork::findOrFail($id);
        $locale = $request->input('locale', 'fr');

        $request->validate([
            'title' => 'required|string',
        ]);

        $artwork->artwork_translations()->updateOrCreate(
            ['locale' => $locale],
            ['title' => $request->title]
        );

        return response()->json(['message' => 'Œuvre modifiée']);
    }

    public function deleteArtwork($id) {
        Artwork::findOrFail($id)->delete();
        return response()->json(['message' => 'Œuvre supprimée']);
    }

    // --- GESTION DES ÉVÉNEMENTS ---

    public function storeEvent(Request $request) {
        $locale = $request->input('locale', 'fr');
        $request->validate([
            'title' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        DB::transaction(function () use ($request, $locale) {
            $event = Event::create($request->only(['start_date', 'end_date', 'location_url']));
            $event->event_translations()->create([
                'locale' => $locale,
                'title' => $request->title,
                'venue_name' => 'N/A',
                'description' => $request->description ?? ''
            ]);
        });

        return response()->json(['message' => 'Événement créé']);
    }

    public function updateEvent(Request $request, $id) {
        $event = Event::findOrFail($id);
        $locale = $request->input('locale', 'fr');

        $event->update($request->only(['start_date', 'end_date', 'location_url']));
        $event->event_translations()->updateOrCreate(
            ['locale' => $locale],
            ['title' => $request->title]
        );

        return response()->json(['message' => 'Événement mis à jour']);
    }

    public function deleteEvent($id) {
        Event::findOrFail($id)->delete();
        return response()->json(['message' => 'Événement supprimé']);
    }
}