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

class ArtistMockSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Category::truncate();
        Artist::truncate();
        Artwork::truncate();
        Event::truncate();
        DB::table('artist_event')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Catégories trilingues
        $categoriesList = [
            ['fr' => 'Peinture Abstraite',       'ar' => 'لوحة تجريدية',    'en' => 'Abstract Painting'],
            ['fr' => 'Sculpture Moderne',         'ar' => 'نحت حديث',        'en' => 'Modern Sculpture'],
            ['fr' => 'Photographie Artistique',   'ar' => 'تصوير فني',       'en' => 'Artistic Photography'],
            ['fr' => 'Art Numérique',              'ar' => 'فن رقمي',         'en' => 'Digital Art'],
            ['fr' => 'Illustration',              'ar' => 'توضيح',           'en' => 'Illustration'],
            ['fr' => 'Art Contemporain',          'ar' => 'الفن المعاصر',    'en' => 'Contemporary Art'],
        ];

        $categoryMap = [];
        foreach ($categoriesList as $names) {
            $cat = Category::create([
                'image_banner' => 'default_banner.jpg',
                'name'         => $names,
            ]);
            $categoryMap[$names['fr']] = $cat->id;
        }

        // 2. Les 7 artistes mock (+ Lois van Baarle)
        $mocks = [
            [
                'name'   => 'Anthony Chambaud',
                'slug'   => 'anthony-chambaud',
                'cat'    => 'Peinture Abstraite',
                'bio_fr' => "Artiste peintre français spécialisé dans l'art abstrait, Antony Chambaud se distingue par son approche instinctive de la couleur et de la texture. À travers ses compositions vibrantes, il explore le mouvement et l'émotion pure.",
                'bio_ar' => 'رسام فرنسي متخصص في الفن التجريدي، يتميز بأسلوبه الغريزي في التعامل مع الألوان والملمس.',
                'bio_en' => 'French abstract painter known for his instinctive approach to color and texture, exploring movement and pure emotion.',
                'city'   => 'Paris',
                'country'=> 'France',
            ],
            [
                'name'   => 'Emmanuel Sellier',
                'slug'   => 'emmanuel-sellier',
                'cat'    => 'Sculpture Moderne',
                'bio_fr' => 'Sculpteur contemporain, Emmanuel Sellier explore les formes et volumes avec une sensibilité unique. Ses œuvres interrogent les relations entre matière et espace.',
                'bio_ar' => 'نحات معاصر يستكشف الأشكال والأحجام بحساسية فريدة.',
                'bio_en' => 'Contemporary sculptor exploring forms and volumes with a unique sensibility.',
                'city'   => 'Lyon',
                'country'=> 'France',
            ],
            [
                'name'   => 'Hannah Reyes Morales',
                'slug'   => 'hannah-reyes-morales',
                'cat'    => 'Photographie Artistique',
                'bio_fr' => "Photographe documentaire reconnue internationalement, Hannah Reyes Morales crée des récits visuels puissants qui donnent une voix aux communautés marginalisées.",
                'bio_ar' => 'مصورة وثائقية معترف بها دوليًا، تخلق روايات بصرية تمنح صوتًا للمجتمعات المهمشة.',
                'bio_en' => 'Internationally recognized documentary photographer creating powerful visual narratives.',
                'city'   => 'Manila',
                'country'=> 'Philippines',
            ],
            [
                'name'   => 'Mad Dog Jones',
                'slug'   => 'mad-dog-jones',
                'cat'    => 'Art Numérique',
                'bio_fr' => "Artiste numérique canadien et pionnier de l'art NFT, Michah Dowbak (alias Mad Dog Jones) fusionne esthétique synthwave et dystopie pour créer des mondes visuels immersifs.",
                'bio_ar' => 'فنان رقمي كندي ورائد في فن NFT، يدمج الجمالية السينثويف مع الديستوبيا.',
                'bio_en' => 'Canadian digital artist and NFT art pioneer, fusing synthwave aesthetics with dystopian worlds.',
                'city'   => 'Vancouver',
                'country'=> 'Canada',
            ],
            [
                'name'   => 'Karla Ortiz',
                'slug'   => 'karla-ortiz',
                'cat'    => 'Illustration',
                'bio_fr' => "Illustratrice et concept artist de renom, Karla Ortiz a contribué à des productions majeures de Marvel et Disney. Son œuvre explore la mythologie, l'identité culturelle et le fantastique.",
                'bio_ar' => 'رسامة توضيحية وفنانة مفاهيم بارزة، ساهمت في إنتاجات كبرى لمارفل وديزني.',
                'bio_en' => 'Renowned illustrator and concept artist who contributed to major Marvel and Disney productions.',
                'city'   => 'San Francisco',
                'country'=> 'USA',
            ],
            [
                'name'   => 'Cecily Brown',
                'slug'   => 'cecily-brown',
                'cat'    => 'Art Contemporain',
                'bio_fr' => "Peintre britannique établie à New York, Cecily Brown est célèbre pour ses tableaux figuratifs et abstraits à l'énergie débordante, mêlant influences classiques et expressionnisme contemporain.",
                'bio_ar' => 'رسامة بريطانية مقيمة في نيويورك، معروفة بلوحاتها التشخيصية والتجريدية الفائضة بالطاقة.',
                'bio_en' => 'British painter based in New York, celebrated for her energetic figurative and abstract paintings.',
                'city'   => 'New York',
                'country'=> 'USA',
            ],
            [
                'name'   => 'Lois van Baarle',
                'slug'   => 'lois-van-baarle',
                'cat'    => 'Illustration',
                'bio_fr' => "Plus connue sous le pseudonyme 'Loish', Lois van Baarle est une illustratrice et concept artist néerlandaise de renommée mondiale. Son style unique, caractérisé par des lignes fluides et une maîtrise exceptionnelle de la lumière, a influencé une génération d'artistes numériques.",
                'bio_ar' => "المعروفة بـ'لويش'، لويس فان بارلي فنانة توضيحية هولندية ذات شهرة عالمية، أسلوبها الفريد أثّر في جيل كامل من فناني الرسوم الرقمية.",
                'bio_en' => "Known as 'Loish', Lois van Baarle is a world-renowned Dutch illustrator and concept artist. Her unique style, characterized by fluid lines and exceptional mastery of light, has influenced a generation of digital artists.",
                'city'   => 'Amsterdam',
                'country'=> 'Pays-Bas',
            ],
        ];

        $artistMap = []; // slug => Artist model

        foreach ($mocks as $m) {
            $nameParts = explode(' ', $m['name']);
            $firstName = $nameParts[0];
            $lastName  = implode(' ', array_slice($nameParts, 1));

            $user = User::create([
                'first_name'        => $firstName,
                'last_name'         => $lastName,
                'email'             => strtolower(str_replace(' ', '.', $m['name'])) . '@example.com',
                'password'          => Hash::make('password'),
                'role'              => 'artiste',
                'locale'            => 'fr',
                'email_verified_at' => now(),
            ]);

            $artist = Artist::create([
                'user_id'     => $user->id,
                'category_id' => $categoryMap[$m['cat']],
                'city'        => $m['city'],
                'country'     => $m['country'],
                'image_url'   => "/images/{$m['slug']}-artiste-1.webp",
                'slug'        => $m['slug'],
                'stage_name'  => ['fr' => $m['name'], 'ar' => $m['name'], 'en' => $m['name']],
                'bio'         => ['fr' => $m['bio_fr'], 'ar' => $m['bio_ar'], 'en' => $m['bio_en']],
                'specialite'  => [
                    'fr' => $m['cat'],
                    'ar' => $this->translateCat($m['cat'], 'ar'),
                    'en' => $this->translateCat($m['cat'], 'en'),
                ],
                'views_count'  => rand(100, 5000),
                'clicks_count' => rand(20, 500),
            ]);

            // Œuvres (2 par artiste)
            for ($i = 1; $i <= 2; $i++) {
                Artwork::create([
                    'artist_id'     => $artist->id,
                    'category_id'   => $artist->category_id,
                    'image_url'     => "/images/{$m['slug']}-{$i}.jpg",
                    'date_creation' => now()->subMonths(rand(1, 24)),
                    'title' => [
                        'fr' => "Œuvre {$i} — " . $m['name'],
                        'ar' => "عمل {$i} — " . $m['name'],
                        'en' => "Artwork {$i} — " . $m['name'],
                    ],
                    'description' => [
                        'fr' => "Une pièce remarquable issue de la collection de " . $m['name'] . ".",
                        'ar' => "قطعة رائعة من مجموعة " . $m['name'] . ".",
                        'en' => "A remarkable piece from " . $m['name'] . "'s collection.",
                    ],
                ]);
            }

            $artistMap[$m['slug']] = $artist;
        }

        // 3. Événements (6 events variés, liés aux artistes)
        $eventsData = [
            [
                'title'       => ['fr' => 'Exposition Couleurs & Émotions', 'ar' => 'معرض الألوان والمشاعر', 'en' => 'Colors & Emotions Exhibition'],
                'description' => ['fr' => "Une plongée dans l'art abstrait de Chambaud et les illustrations de Karla Ortiz.", 'ar' => 'رحلة في الفن التجريدي والرسوم التوضيحية.', 'en' => 'A dive into abstract art and illustration.'],
                'venue_name'  => 'Galerie Nationale, Paris',
                'type'        => 'Exposition',
                'start_date'  => now()->addDays(10),
                'end_date'    => now()->addDays(30),
                'location_url'=> 'https://maps.google.com/?q=Galerie+Nationale+Paris',
                'artists'     => ['anthony-chambaud', 'karla-ortiz'],
            ],
            [
                'title'       => ['fr' => 'Festival Art Numérique 2025', 'ar' => 'مهرجان الفن الرقمي 2025', 'en' => 'Digital Art Festival 2025'],
                'description' => ['fr' => "Mad Dog Jones et Lois van Baarle à l'honneur dans ce festival international dédié à l'art numérique.", 'ar' => 'مهرجان دولي مخصص للفن الرقمي.', 'en' => 'International festival dedicated to digital art.'],
                'venue_name'  => 'Centre Pompidou, Paris',
                'type'        => 'Festival',
                'start_date'  => now()->addDays(45),
                'end_date'    => now()->addDays(50),
                'location_url'=> 'https://maps.google.com/?q=Centre+Pompidou+Paris',
                'artists'     => ['mad-dog-jones', 'lois-van-baarle'],
            ],
            [
                'title'       => ['fr' => 'Atelier Photographie Documentaire', 'ar' => 'ورشة التصوير الوثائقي', 'en' => 'Documentary Photography Workshop'],
                'description' => ['fr' => "Hannah Reyes Morales anime un atelier intensif sur la photographie documentaire et le storytelling visuel.", 'ar' => 'ورشة مكثفة حول التصوير الوثائقي.', 'en' => 'Intensive workshop on documentary photography and visual storytelling.'],
                'venue_name'  => 'Institut Français, Casablanca',
                'type'        => 'Atelier',
                'start_date'  => now()->addDays(20),
                'end_date'    => now()->addDays(22),
                'location_url'=> 'https://maps.google.com/?q=Institut+Francais+Casablanca',
                'artists'     => ['hannah-reyes-morales'],
            ],
            [
                'title'       => ['fr' => 'Nuit de la Sculpture Contemporaine', 'ar' => 'ليلة النحت المعاصر', 'en' => 'Contemporary Sculpture Night'],
                'description' => ['fr' => "Soirée exclusive autour des œuvres d'Emmanuel Sellier et de Cecily Brown. Vernissage et performance live.", 'ar' => 'سهرة حصرية حول أعمال النحت والرسم المعاصر.', 'en' => 'Exclusive evening around contemporary sculpture and painting.'],
                'venue_name'  => 'Musée d\'Art Moderne, Paris',
                'type'        => 'Exposition',
                'start_date'  => now()->subDays(5),
                'end_date'    => now()->addDays(15),
                'location_url'=> 'https://maps.google.com/?q=Musee+Art+Moderne+Paris',
                'artists'     => ['emmanuel-sellier', 'cecily-brown'],
            ],
            [
                'title'       => ['fr' => 'Concert & Art — Fusion Créative', 'ar' => 'موسيقى وفن — إبداع مشترك', 'en' => 'Concert & Art — Creative Fusion'],
                'description' => ['fr' => "Une soirée mêlant musique live et exposition d'art numérique. Mad Dog Jones et Lois van Baarle créent en direct.", 'ar' => 'مساء يجمع الموسيقى الحية والفن الرقمي.', 'en' => 'An evening mixing live music and digital art exhibition.'],
                'venue_name'  => 'Zénith de Casablanca',
                'type'        => 'Concert',
                'start_date'  => now()->addDays(60),
                'end_date'    => now()->addDays(60),
                'location_url'=> 'https://maps.google.com/?q=Zenith+Casablanca',
                'artists'     => ['mad-dog-jones', 'lois-van-baarle', 'karla-ortiz'],
            ],
            [
                'title'       => ['fr' => 'Rétrospective — Loish & Concept Art', 'ar' => 'استعراض — لويش وفن المفاهيم', 'en' => 'Retrospective — Loish & Concept Art'],
                'description' => ['fr' => "Une rétrospective complète de l'œuvre de Lois van Baarle, de ses débuts jusqu'à ses collaborations avec les plus grands studios.", 'ar' => 'استعراض شامل لأعمال لويش.', 'en' => "A complete retrospective of Lois van Baarle's work, from beginnings to studio collaborations."],
                'venue_name'  => 'Stedelijk Museum, Amsterdam',
                'type'        => 'Exposition',
                'start_date'  => now()->addDays(90),
                'end_date'    => now()->addDays(120),
                'location_url'=> 'https://maps.google.com/?q=Stedelijk+Museum+Amsterdam',
                'artists'     => ['lois-van-baarle', 'karla-ortiz'],
            ],
        ];

        foreach ($eventsData as $ev) {
            $event = Event::create([
                'title'        => $ev['title'],
                'description'  => $ev['description'],
                'venue_name'   => $ev['venue_name'],
                'type'         => $ev['type'],
                'start_date'   => $ev['start_date'],
                'end_date'     => $ev['end_date'],
                'location_url' => $ev['location_url'],
            ]);

            // Liaison artistes <-> événement
            foreach ($ev['artists'] as $slug) {
                if (isset($artistMap[$slug])) {
                    $event->artists()->attach($artistMap[$slug]->id);
                }
            }
        }
    }

    /**
     * Traduit les noms de catégories pour le champ specialite
     */
    private function translateCat(string $fr, string $lang): string
    {
        $map = [
            'Peinture Abstraite'     => ['ar' => 'لوحة تجريدية',    'en' => 'Abstract Painting'],
            'Sculpture Moderne'      => ['ar' => 'نحت حديث',        'en' => 'Modern Sculpture'],
            'Photographie Artistique'=> ['ar' => 'تصوير فني',       'en' => 'Artistic Photography'],
            'Art Numérique'          => ['ar' => 'فن رقمي',         'en' => 'Digital Art'],
            'Illustration'           => ['ar' => 'توضيح',           'en' => 'Illustration'],
            'Art Contemporain'       => ['ar' => 'الفن المعاصر',    'en' => 'Contemporary Art'],
        ];
        return $map[$fr][$lang] ?? $fr;
    }
}