<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Carbon\Carbon;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $locale   = strtolower($request->query('locale', 'fr'));
        $type     = $request->query('type', 'Tous');
        $country  = $request->query('country');
        $date     = $request->query('date');
        $artistId = $request->query('artist');

        Carbon::setLocale($locale);
        $query = Event::query();

        // Mapping complet pluriel → singulier pour correspondre aux données en BDD
        if ($type !== 'Tous') {
            $typeMap = [
                'Expositions' => 'Exposition',
                'Exposition'  => 'Exposition',
                'Concerts'    => 'Concert',
                'Concert'     => 'Concert',
                'Ateliers'    => 'Atelier',
                'Atelier'     => 'Atelier',
                'Festivals'   => 'Festival',
                'Festival'    => 'Festival',
            ];
            $searchType = $typeMap[$type] ?? $type;
            $query->where('type', $searchType);
        }

        if ($country) {
            $query->where(function ($q) use ($country) {
                $q->where('venue_name', 'LIKE', '%' . $country . '%')
                  ->orWhere('location_url', 'LIKE', '%' . $country . '%');
            });
        }

        if ($date) {
            $query->whereDate('start_date', '<=', $date)
                  ->whereDate('end_date', '>=', $date);
        }

        if ($artistId) {
            $query->whereHas('artists', function ($q) use ($artistId) {
                $q->where('artists.id', $artistId);
            });
        }

        $events = $query->with('artists')->orderBy('start_date', 'asc')->get();

        return response()->json($events->map(function ($event) use ($locale) {
            $participants = $event->artists->map(function ($artist) use ($locale) {
                $names = $artist->stage_name;
                if (is_array($names)) {
                    return $names[$locale] ?? $names['fr'] ?? $names['en'] ?? 'Artiste';
                }
                return $names ?? 'Artiste';
            })->unique()->implode(', ');

            return [
                'id'           => $event->id,
                'title'        => $event->title,
                'description'  => $event->description,
                'venue_name'   => $event->venue_name,
                'type'         => $event->type,
                'participants' => $participants,
                'location_url' => $event->location_url,
                'start_date'   => Carbon::parse($event->start_date)->translatedFormat('d F Y'),
                'end_date'     => Carbon::parse($event->end_date)->translatedFormat('d F Y'),
                'status'       => $this->calculateStatus($event->start_date, $event->end_date),
            ];
        }));
    }

    public function getLocations()
    {
        $locations = Event::whereNotNull('venue_name')
            ->distinct()
            ->pluck('venue_name')
            ->toArray();

        return response()->json($locations);
    }

    private function calculateStatus($start, $end)
    {
        $now       = now();
        $startDate = Carbon::parse($start);
        $endDate   = Carbon::parse($end);

        if ($now < $startDate) return ['label' => 'À venir',  'class' => 'st-upcoming'];
        if ($now > $endDate)   return ['label' => 'Terminé',  'class' => 'st-past'];
        return                        ['label' => 'En cours', 'class' => 'st-current'];
    }
}