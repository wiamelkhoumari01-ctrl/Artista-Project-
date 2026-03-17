@component('mail::message')
# Nouveau message de contact

Tu as reçu un nouveau message depuis le formulaire de ton site **Artista**.

**Détails de l'expéditeur :**
* **Nom :** {{ $data['name'] }}
* **Email :** {{ $data['email'] }}

**Message :**
@component('mail::panel')
{{ $data['message'] }}
@endcomponent

@component('mail::button', ['url' => 'mailto:' . $data['email']])
Répondre directement
@endcomponent

Cordialement,<br>
L'équipe Artista
@endcomponent