<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Carbon\Carbon;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->query('locale', 'fr'); // Langue par défaut
        $type = $request->query('type', 'Tous'); // Filtre de catégorie

        $query = Event::with(['translations' => function($q) use ($locale) {
            $q->where('locale', $locale);
        }, 'artists.translations' => function($q) use ($locale) {
            $q->where('locale', $locale);
        }]);

        // Filtrage dynamique selon la pilule cliquée
        if ($type !== 'Tous') {
            $query->where('type', $type);
        }

        // Tri chronologique précis grâce au format dateTime
        $events = $query->orderBy('start_date', 'asc')->get();

        return response()->json($events->map(function($event) use ($locale) {
            $trans = $event->translations->first();
            $artist = $event->artists->first();
            $artTrans = $artist ? $artist->translations->where('locale', $locale)->first() : null;

            return [
                'id' => $event->id,
                'title' => $trans->title ?? 'Untitled',
                'description' => $trans->description ?? '',
                'venue' => $trans->venue_name ?? '',
                'artist_name' => $artTrans ? ($artTrans->first_name . ' ' . $artTrans->last_name) : 'Artiste Artista',
                'start_date' => Carbon::parse($event->start_date)->translatedFormat('d F Y'),
                'end_date' => Carbon::parse($event->end_date)->translatedFormat('d F Y'),
                'status' => $this->calculateStatus($event->start_date, $event->end_date)
            ];
        }));
    }

    private function calculateStatus($start, $end)
    {
        $now = now();
        if ($now < $start) return ['label' => 'À venir', 'class' => 'st-upcoming'];
        if ($now > $end) return ['label' => 'Passé', 'class' => 'st-past'];
        return ['label' => 'En cours', 'class' => 'st-current'];
    }
}