<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactMessage;

class ContactController extends Controller
{
   public function contact(Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'message' => 'required|string|max:1000',
    ]);

    try {
        Mail::to(config('mail.from.address'))
            ->send(new ContactMessage($validated));

        return response()->json(['success' => true, 'message' => 'Message envoyé avec succès !']);
    } catch (\Exception $e) {
       
        Log::error("Erreur envoi mail : " . $e->getMessage());
        return response()->json(['success' => false, 'message' => 'Erreur technique.'], 500);
    }
}
}