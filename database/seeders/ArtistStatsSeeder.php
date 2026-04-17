<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Artist;
use App\Models\ArtistStat;
use Carbon\Carbon;

class ArtistStatsSeeder extends Seeder
{
    public function run()
    {
        $artists = Artist::all();

        if ($artists->isEmpty()) {
            $this->command->info("Aucun artiste trouvé.");
            return;
        }

        $this->command->info("Mise à jour des vues pour " . $artists->count() . " artistes...");

        foreach ($artists as $artist) {
            // 1. On nettoie les anciennes stats par date
            ArtistStat::where('artist_id', $artist->id)->delete();

            $totalViews = 0;

            // 2. On génère des vues aléatoires sur les 30 derniers jours
            for ($i = 30; $i >= 0; $i--) {
                $date  = Carbon::now()->subDays($i);
                $views = rand(10, 150);

                ArtistStat::create([
                    'artist_id' => $artist->id,
                    'date'      => $date->format('Y-m-d'),
                    'views'     => $views,
                    'clicks'    => 0, 
                ]);

                $totalViews += $views;
            }

            // 3. On met à jour uniquement views_count (clicks_count a été retiré de ta migration)
            $artist->update([
                'views_count' => $totalViews,
            ]);
        }

        $this->command->info("Vues synchronisées avec succès !");
    }
}