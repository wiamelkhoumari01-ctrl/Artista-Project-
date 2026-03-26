<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Language;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Nettoyer les tables pour repartir de l'ID 1
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        Language::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Créer la langue d'abord
        Language::updateOrCreate(
            ['id' => 1],
            ['code' => 'fr', 'name' => 'Français', 'is_default' => true]
        );

        // 2. Créer l'Admin (ID 1)
        User::updateOrCreate(
            ['email' => 'admin@artista.com'],
            [
                'password' => Hash::make('0azerty321'),
                'role' => 'admin',
                'language_id' => 1,
            ]
        );

        // 3. Créer EXACTEMENT 20 utilisateurs (IDs 2 à 21)
        User::factory(20)->create(['language_id' => 1]);

        // 4. Appeler ton Seeder d'artistes Mocks (IDs 22 à 28)
        $this->call([
            ArtistMockSeeder::class,
        ]);
    }
}