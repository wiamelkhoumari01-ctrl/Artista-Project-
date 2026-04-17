<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. D'abord la table principale (la "parente")
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('type');
            $table->json('title');
            $table->string('venue_name');
            $table->json('description')->nullable();
            $table->string('location_url')->nullable();
            $table->timestamps();
        });

        // 3. Enfin la table pivot (elle dépend de 'artists' et de 'events')
        Schema::create('artist_event', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_id')->constrained()->onDelete('cascade');
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        // On supprime dans l'ordre inverse pour éviter les conflits
        Schema::dropIfExists('artist_event');
        Schema::dropIfExists('events');
    }
};