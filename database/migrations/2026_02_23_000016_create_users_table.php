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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // On garde le nom et l'email comme base
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            // --- TES AJOUTS PERSONNALISÉS ---
            // Le rôle pour différencier tes utilisateurs
            $table->enum('role', ['admin', 'artiste', 'utilisateur'])->default('utilisateur');
            
            // La langue préférée (Assure-toi que la migration 'languages' est créée AVANT celle-ci)
            $table->foreignId('language_id')->constrained('languages')->onDelete('cascade');
            // --------------------------------

            $table->rememberToken();
            $table->timestamps();
        });

        // Ces tables sont gérées par Laravel pour la sécurité et les sessions
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};