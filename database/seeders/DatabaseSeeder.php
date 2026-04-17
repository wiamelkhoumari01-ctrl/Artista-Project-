<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Artist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        DB::table('artist_event')->truncate();
        DB::table('artist_stats')->truncate();
        DB::table('artwork_images')->truncate();
        DB::table('artworks')->truncate();
        DB::table('events')->truncate();
        DB::table('artists')->truncate();
        DB::table('categories')->truncate();
        DB::table('personal_access_tokens')->truncate();
        User::truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Utilisation des variables d'environnement
        User::create([
            'first_name'        => env('ADMIN_FIRST_NAME', 'Admin'),
            'last_name'         => env('ADMIN_LAST_NAME', 'Artista'),
            'email'             => env('ADMIN_EMAIL', 'admin@artista.com'),
            'password'          => Hash::make(env('ADMIN_PASSWORD', '0azerty321')),
            'role'              => 'admin',
            'locale'            => 'fr',
            'email_verified_at' => now(),
        ]);

        User::factory(20)->create();

        $this->call([
            ArtistMockSeeder::class,
            ArtistStatsSeeder::class,
        ]);
    }
}