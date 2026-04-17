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
        // Nettoyage complet dans le bon ordre
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

        // 1. Admin
        User::create([
            'first_name'        => 'Admin',
            'last_name'         => 'Artista',
            'email'             => 'admin@artista.com',
            'password'          => Hash::make('0azerty321'),
            'role'              => 'admin',
            'locale'            => 'fr',
            'email_verified_at' => now(),
        ]);

        // 2. Utilisateurs lambda
        User::factory(20)->create();

        // 3. Artistes mock + events
        $this->call([
            ArtistMockSeeder::class,
            ArtistStatsSeeder::class,
        ]);
    }
}