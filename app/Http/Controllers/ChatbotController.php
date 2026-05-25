<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Artist;
use App\Models\Event;

class ChatbotController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string|max:500']);

        // Contexte dynamique depuis la BDD
        $artists = Artist::with('category')
            ->orderByDesc('views_count')
            ->take(10)
            ->get()
            ->map(fn($a) => [
                'nom'      => is_array($a->stage_name) ? ($a->stage_name['fr'] ?? '') : $a->stage_name,
                'ville'    => $a->city,
                'pays'     => $a->country,
                'categorie'=> is_array($a->category?->name) ? ($a->category->name['fr'] ?? '') : $a->category?->name,
                'slug'     => $a->slug,
            ]);

        $events = Event::orderBy('start_date')
            ->where('start_date', '>=', now())
            ->take(5)
            ->get()
            ->map(fn($e) => [
                'titre'    => is_array($e->title) ? ($e->title['fr'] ?? '') : $e->title,
                'lieu'     => $e->venue_name,
                'type'     => $e->type,
                'debut'    => $e->start_date?->format('d/m/Y'),
                'fin'      => $e->end_date?->format('d/m/Y'),
            ]);

        $systemPrompt = "Tu es l'assistant virtuel d'ARTISTA, une plateforme marocaine dédiée aux artistes.
Tu réponds uniquement en français, de manière courte, chaleureuse et professionnelle (max 3 phrases).
Tu ne parles que d'ARTISTA, de ses artistes et de ses événements.
Si la question ne concerne pas ARTISTA, redirige poliment vers les sujets disponibles.

Voici les artistes disponibles sur la plateforme :
" . json_encode($artists, JSON_UNESCAPED_UNICODE) . "

Voici les prochains événements :
" . json_encode($events, JSON_UNESCAPED_UNICODE);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
            'Content-Type'  => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'max_tokens' => 300,
            'messages'   => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user',   'content' => $request->message],
            ],
        ]);

       if ($response->failed()) {
            \Illuminate\Support\Facades\Log::error('Groq API error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return response()->json([
                'reply' => "Erreur API: " . $response->status() . " — " . $response->body()
            ], 200);
        }

        $reply = $response->json('choices.0.message.content') ?? "Je n'ai pas compris. Pouvez-vous reformuler ?";

        return response()->json(['reply' => $reply]);
    }
}