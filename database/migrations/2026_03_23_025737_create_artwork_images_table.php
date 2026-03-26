<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('artwork_images', function (Blueprint $table) {
            $table->id();
            // foreignId crée un BIGINT UNSIGNED qui correspond exactement à l'ID de artworks
            $table->foreignId('artwork_id')
                ->constrained('artworks') // On précise la table cible par sécurité
                ->onDelete('cascade');    // Nettoyage automatique
            $table->string('path');         // Chemin vers l'image optimisée
            $table->boolean('is_main')->default(false); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artwork_images');
    }
};
