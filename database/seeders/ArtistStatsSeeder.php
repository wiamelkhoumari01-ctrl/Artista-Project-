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
        // On récupère le premier artiste pour le test
        $artist = Artist::first();

        if (!$artist) {
            $this->command->info("Aucun artiste trouvé. Créez d'abord un compte artiste.");
            return;
        }

        $this->command->info("Génération des stats pour l'artiste : " . $artist->id);

        // Nettoyage des anciennes stats de test
        ArtistStat::where('artist_id', $artist->id)->delete();

        $totalViews = 0;

        // Générer 30 jours de données
        for ($i = 30; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            // On génère un nombre de vues aléatoire entre 10 et 100
            $views = rand(10, 100);
            
            ArtistStat::create([
                'artist_id' => $artist->id,
                'date' => $date->format('Y-m-d'),
                'views' => $views,
            ]);

            $totalViews += $views;
        }

        // Mettre à jour le compteur global dans la table artists
        $artist->update([
            'views_count' => $totalViews,
            'clicks_count' => rand(50, 200)
        ]);

        $this->command->info("Stats générées avec succès ! Total vues : " . $totalViews);
    }
}

// <?php

// namespace Database\Seeders;

// use Illuminate\Database\Seeder;
// use App\Models\Artist;
// use App\Models\ArtistStat;
// use Carbon\Carbon;

// class ArtistStatsSeeder extends Seeder
// {
//     public function run()
//     {
//         // 1. On récupère TOUS les artistes de la base de données
//         $artists = Artist::all();

//         if ($artists->isEmpty()) {
//             $this->command->error("Aucun artiste trouvé en base de données. Veuillez d'abord créer des artistes.");
//             return;
//         }

//         $this->command->info("Début de la génération des statistiques pour " . $artists->count() . " artistes...");

//         foreach ($artists as $artist) {
//             $this->command->info("Traitement de l'artiste ID : " . $artist->id);

//             // 2. Nettoyage : On supprime les anciennes stats de cet artiste pour repartir à zéro
//             ArtistStat::where('artist_id', $artist->id)->delete();

//             $totalViews = 0;

//             // 3. Génération de 30 jours de données pour cet artiste
//             for ($i = 30; $i >= 0; $i--) {
//                 $date = Carbon::now()->subDays($i);
                
//                 // On génère un nombre de vues aléatoire (entre 5 et 150 pour varier)
//                 $views = rand(5, 150);
                
//                 ArtistStat::create([
//                     'artist_id' => $artist->id,
//                     'date' => $date->format('Y-m-d'),
//                     'views' => $views,
//                 ]);

//                 $totalViews += $views;
//             }

//             // 4. Mise à jour des compteurs globaux dans la table 'artists'
//             $artist->update([
//                 'views_count' => $totalViews,
//                 'clicks_count' => rand(20, 300) // Simulation de clics aléatoires
//             ]);

//             $this->command->line(" -> Succès : $totalViews vues générées.");
//         }

//         $this->command->info("### Toutes les statistiques ont été générées avec succès ! ###");
//     }
// }