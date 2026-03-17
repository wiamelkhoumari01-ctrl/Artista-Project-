<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ContactController extends Controller
{
   public function contact(Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'message' => 'required|string|max:1000',
    ]);

    try {
        // Envoi immédiat à ton adresse
        \Illuminate\Support\Facades\Mail::to('wiamelkhoumari01@gmail.com')
            ->send(new \App\Mail\ContactMessage($validated));

        return response()->json(['success' => true, 'message' => 'Message envoyé avec succès !']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => 'Erreur technique.'], 500);
    }
}
}
