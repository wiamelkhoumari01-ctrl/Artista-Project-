<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Carbon\Carbon;

class EventController extends Controller
{
    public function index(Request $request)
    {
        // Nettoyage de la locale et du type
        $locale = strtolower($request->query('locale', 'fr')); 
        $type = $request->query('type', 'Tous');
        
        Carbon::setLocale($locale);

        $query = Event::query();

        // Filtrage par type
        if ($type !== 'Tous') {
            $searchType = ($type === 'Expositions') ? 'Exposition' : $type;
            $query->where('type', $searchType);
        }

        // Récupération des événements avec leurs artistes et les traductions d'artistes
        // On trie par date de début
        $events = $query->with(['artists.artist_translations'])->orderBy('start_date', 'asc')->get();

        return response()->json($events->map(function($event) use ($locale) {
            // 1. Traduction de l'événement (Titre, Lieu, etc.)
            $translation = $event->translate($locale);

            // 2. Récupération de TOUS les artistes participants (pour éviter les doublons de cartes)
            $participants = $event->artists->map(function($artist) use ($locale) {
                $aTrans = $artist->translate($locale);
                if ($aTrans) {
                    return $aTrans->stage_name ?: ($aTrans->first_name . ' ' . $aTrans->last_name);
                }
                return 'Artiste inconnu';
            })->unique()->implode(', '); // On joint les noms par une virgule

            return [
                'id' => $event->id,
                'title' => $translation->title ?? 'Untitled',
                'description' => $translation->description ?? '',
                'venue' => $translation->venue_name ?? 'Lieu à confirmer',
                'type' => $event->type,
                'participants' => $participants, // Liste groupée des artistes
                'start_date' => Carbon::parse($event->start_date)->translatedFormat('d F Y'),
                'end_date' => Carbon::parse($event->end_date)->translatedFormat('d F Y'),
                'status' => $this->calculateStatus($event->start_date, $event->end_date)
            ];
        }));
    }

    private function calculateStatus($start, $end)
    {
        $now = now();
        $startDate = Carbon::parse($start);
        $endDate = Carbon::parse($end);

        if ($now < $startDate) {
            return ['label' => 'À venir', 'class' => 'st-upcoming'];
        }
        if ($now > $endDate) {
            return ['label' => 'Terminé', 'class' => 'st-past'];
        }
        return ['label' => 'En cours', 'class' => 'st-current'];
    }
}