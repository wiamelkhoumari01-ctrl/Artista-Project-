<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Artist;
use App\Models\Artwork;
use App\Models\Event;
use App\Models\Category;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str; // Ajouté pour éviter l'erreur str_slug

class ArtistMockSeeder extends Seeder
{
    public function run()
    {
        // 1. Désactiver les clés étrangères pour nettoyer proprement
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        User::where('role', 'artiste')->delete();
        Artist::truncate();
        DB::table('artist_translations')->truncate();
        Artwork::truncate();
        DB::table('artwork_translations')->truncate();
        Event::truncate();
        DB::table('event_translations')->truncate();
        DB::table('artist_event')->truncate();
        Category::truncate();
        DB::table('category_translations')->truncate();

        // 2. Créer les catégories réelles pour le filtrage
        $categoriesList = [
            'Peinture Abstraite',
            'Sculpture Moderne',
            'Photographie Artistique',
            'Art Numérique',
            'Illustration',
            'Art Contemporain'
        ];

        $categoryMap = [];
        foreach ($categoriesList as $catName) {
            $cat = Category::create(['image_banner' => 'default_banner.jpg']);
            $cat->category_translations()->create([
                'locale' => 'fr',
                'name' => $catName
            ]);
            $categoryMap[$catName] = $cat->id;
        }

        // 3. Liste des artistes (Gardée strictement à l'identique)
        $mocks = [
            [
                'name' => 'Anthony Chambaud', 
                'slug' => 'anthony-chambaud', 
                'email' => 'anthony@example.com', 
                'category' => 'Peinture Abstraite',
                'bio' => 'Artiste peintre passionné par l\'exploration des couleurs.'
            ],
            [
                'name' => 'Emmanuel Sellier', 
                'slug' => 'emmanuel-sellier', 
                'email' => 'emmanuel@example.com', 
                'category' => 'Sculpture Moderne',
                'bio' => 'Sculpteur contemporain transformant la matière.'
            ],
            [
                'name' => 'Hannah Reyes Morales', 
                'slug' => 'hannah-reyes-morales', 
                'email' => 'hannah@example.com', 
                'category' => 'Photographie Artistique',
                'bio' => 'Photographe documentaire capturant des histoires humaines.'
            ],
            [
                'name' => 'Mad Dog Jones', 
                'slug' => 'mad-dog-jones', 
                'email' => 'maddog@example.com', 
                'category' => 'Art Numérique',
                'bio' => 'Pionnier de l\'art numérique et du synthwave.'
            ],
            [
                'name' => 'Karla Ortiz', 
                'slug' => 'karla-ortiz', 
                'email' => 'karla@example.com', 
                'category' => 'Illustration',
                'bio' => 'Illustratrice et concept artist renommée.'
            ],
            [
                'name' => 'Cecily Brown', 
                'slug' => 'cecily-brown', 
                'email' => 'cecily@example.com', 
                'category' => 'Art Contemporain',
                'bio' => 'Peintre explorant la figuration et l\'abstraction.'
            ],
            [
                'name' => 'Lois van Baarle', 
                'slug' => 'lois-van-baarle', 
                'email' => 'lois@example.com', 
                'category' => 'Illustration',
                'bio' => 'Artiste digitale connue sous le nom de Loish.'
            ],
        ];

        foreach ($mocks as $m) {
            // Création du User
            $user = User::create([
                'email' => $m['email'],
                'password' => Hash::make('password'),
                'role' => 'artiste',
                'language_id' => 1 
            ]);

            // Photo de profil (Chemin original respecté)
            $profileImagePath = "/images/" . strtolower($m['slug']) . "-artiste-1.webp";

            $artist = Artist::create([
                'user_id'     => $user->id,
                'category_id' => $categoryMap[$m['category']], 
                'city'        => 'Paris',
                'country'     => 'France',
                'image_url'   => $profileImagePath,
                'website'     => 'www.' . $m['slug'] . '.com'
            ]);

            $artist->artist_translations()->create([
                'locale'     => 'fr',
                'first_name' => explode(' ', $m['name'])[0],
                'last_name'  => explode(' ', $m['name'])[1] ?? '',
                'stage_name' => $m['name'],
                'bio'        => $m['bio'],
                'slug'       => $m['slug']
            ]);

            // BOUCLE POUR LES ŒUVRES (Chemin original respecté)
            for ($i = 1; $i <= 2; $i++) {
                $artworkPath = "/images/" . strtolower($m['slug']) . "-" . $i . ".jpg";

                $artwork = Artwork::create([
                    'artist_id'     => $artist->id,
                    'category_id'   => $categoryMap[$m['category']],
                    'image_url'     => $artworkPath,
                    'date_creation' => now()
                ]);

                $artwork->artwork_translations()->create([
                    'locale'      => 'fr',
                    'title'       => "Œuvre n°{$i} de " . $m['name'],
                    'description' => "Une pièce d'exception réalisée par l'artiste."
                ]);
            }

            // Événements - MODIFIÉ POUR ÉVITER LES DOUBLONS
            $eventsData = [
                ['title' => 'Exposition Solo', 'venue' => 'Grand Palais'],
                ['title' => 'Vente aux enchères', 'venue' => 'Drouot'],
            ];

            foreach ($eventsData as $index => $eData) {
                // On vérifie si un événement avec ce titre existe déjà pour ne pas le recréer
                // via la table de traduction (le titre étant notre point de repère)
                $existingTranslation = DB::table('event_translations')
                    ->where('title', $eData['title'])
                    ->where('locale', 'fr')
                    ->first();

                if ($existingTranslation) {
                    // Si l'événement existe, on récupère l'original
                    $event = Event::find($existingTranslation->event_id);
                } else {
                    // Sinon, on le crée proprement une seule fois
                    $event = Event::create([
                        'start_date'   => now()->addMonths($index + 1),
                        'end_date'     => now()->addMonths($index + 1)->addDays(5),
                        'location_url' => 'https://maps.google.com',
                        'type'         => 'Exposition',
                    ]);

                    $event->event_translations()->create([
                        'locale'      => 'fr',
                        'title'       => $eData['title'],
                        'venue_name'  => $eData['venue'],
                        'description' => "Événement majeur réunissant nos artistes."
                    ]);
                }

                // Dans tous les cas, on attache l'artiste à cet événement (unique)
                $artist->events()->attach($event->id);
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}