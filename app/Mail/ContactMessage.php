<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    // Cette variable sera accessible dans ton fichier markdown emails.contact
    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Définit l'enveloppe de l'email (Sujet, Expéditeur, Reply-to)
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouveau message de : ' . $this->data['name'],
            // Permet de répondre directement à l'utilisateur quand tu cliques sur "Répondre" dans Gmail
            replyTo: [
                new Address($this->data['email'], $this->data['name']),
            ],
        );
    }

    /**
     * Définit le contenu de l'email (le fichier Markdown)
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact', // Utilise bien ton fichier avec @component
        );
    }

    public function attachments(): array
    {
        return [];
    }
}