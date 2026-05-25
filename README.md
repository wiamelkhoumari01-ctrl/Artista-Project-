# ARTISTA — Plateforme Portfolio d'Artistes

> Plateforme web dédiée aux artistes marocains et internationaux pour partager leurs œuvres, biographies, événements et interagir avec leur audience.

---

## Description du projet

ARTISTA est une application web fullstack développée avec **Laravel 11** (API REST) et **React 18** (SPA). Elle permet à trois types d'utilisateurs d'interagir avec la plateforme :

- **Visiteurs** : consulter les artistes, œuvres et événements publics
- **Artistes** : gérer leur profil, galerie d'œuvres et événements via un tableau de bord personnel
- **Administrateurs** : gérer l'ensemble des contenus, consulter les KPIs et statistiques avancées

La plateforme supporte **trois langues** (Français, Anglais, Arabe) avec gestion RTL pour l'arabe, et intègre un **chatbot IA** alimenté par l'API Groq (LLaMA 3.3).

---

## Technologies utilisées

### Backend
| Technologie | Version | Usage |
|---|---|---|
| PHP | 8.2+ | Langage serveur |
| Laravel | 11.x | Framework API REST |
| Laravel Sanctum | 4.x | Authentification par token Bearer |
| MySQL | 8.0+ | Base de données relationnelle |
| Intervention Image | 3.x | Traitement et optimisation des images |
| Google API Client | — | Authentification OAuth Google |

### Frontend
| Technologie | Version | Usage |
|---|---|---|
| React | 18.x | Interface utilisateur SPA |
| Vite | 5.x | Bundler et dev server |
| React Router DOM | 6.x | Routing côté client |
| Axios | — | Requêtes HTTP vers l'API |
| Recharts | — | Graphiques KPIs admin |
| Framer Motion | — | Animations et transitions |
| Bootstrap | 5.x | Grille et composants CSS |
| Lucide React | — | Icônes |
| React Dropzone | — | Upload d'images par glisser-déposer |
| @react-oauth/google | — | Bouton Google Login |

### Services externes
| Service | Usage |
|---|---|
| Groq API (LLaMA 3.3-70b) | Chatbot IA intégré |
| Google OAuth 2.0 | Connexion/Inscription via Google |

---

## Installation

### Prérequis

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8.0
- XAMPP ou équivalent

## Structure du projet

```
artista/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AdminController.php       # Gestion admin (artistes, œuvres, événements, KPIs)
│   │   │   ├── ArtistController.php      # Profil artiste, stats, événements
│   │   │   ├── ArtWorkController.php     # CRUD œuvres et images
│   │   │   ├── AuthController.php        # Inscription, login, Google OAuth
│   │   │   ├── ChatbotController.php     # Chatbot IA via Groq API
│   │   │   ├── ContactController.php     # Formulaire de contact
│   │   │   └── EventController.php       # Liste et filtres événements publics
│   │   └── Middleware/
│   │       ├── AdminMiddleware.php        # Vérifie le rôle admin
│   │       ├── CheckRole.php             # Vérifie les rôles autorisés
│   │       └── SetLocale.php             # Définit la langue selon le header
│   └── Models/
│       ├── Artist.php
│       ├── ArtistStat.php
│       ├── Artwork.php
│       ├── ArtworkImage.php
│       ├── Category.php
│       ├── Event.php
│       └── User.php
│
├── database/
│   ├── migrations/                        # Tables, vue SQL, trigger, procédure stockée
│   └── seeders/
│       ├── DatabaseSeeder.php             # Seeder principal
│       ├── ArtistMockSeeder.php           # 7 artistes fictifs avec œuvres et événements
│       └── ArtistStatsSeeder.php          # Vues fictives sur 30 jours
│
├── resources/
│   ├── js/
│   │   ├── App.jsx                        # Point d'entrée React, layout global
│   │   ├── api.js                         # Instance Axios configurée
│   │   ├── components/
│   │   │   ├── feature/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── ui/
│   │   │   │   ├── ArtistCard.jsx
│   │   │   │   ├── FiltrerBar.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   └── Timeline.jsx
│   │   │   ├── ChatBot.jsx                # Chatbot IA flottant
│   │   │   └── LoadingScreen.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx            # Gestion authentification globale
│   │   │   └── LanguageContext.jsx        # Gestion multilingue FR/EN/AR
│   │   ├── pages/
│   │   │   ├── home/                      # Page d'accueil et ses sections
│   │   │   ├── artistes/                  # Liste et détail artiste
│   │   │   ├── evenements/                # Page événements avec filtres
│   │   │   ├── connexion/                 # Login, inscription, mot de passe oublié
│   │   │   ├── Dashboard/                 # Tableau de bord artiste
│   │   │   └── admin/                     # Dashboard et KPIs admin
│   │   ├── langues/
│   │   │   ├── fr.json
│   │   │   ├── en.json
│   │   │   └── ar.json
│   │   └── router/
│   │       └── config.jsx                 # Définition des routes React
│   ├── css/                               # Fichiers CSS par composant
│   └── views/
│       ├── app.blade.php                  # Point d'entrée Blade unique
│       └── layouts/
│           └── app.blade.php              # Layout parent avec @yield
│
├── routes/
│   ├── api.php                            # Toutes les routes API REST
│   └── web.php                            # Route catch-all pour la SPA React
│
└── storage/
    └── app/public/
        └── artistes/                      # Images uploadées par les artistes
```

---

## API Endpoints

### Authentification (publique)
| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/inscription` | Inscription classique |
| POST | `/api/login` | Connexion classique |
| POST | `/api/google-auth` | Inscription via Google |
| POST | `/api/google-login` | Connexion via Google |
| POST | `/api/forgot-password` | Réinitialisation mot de passe |
| POST | `/api/logout` | Déconnexion (token requis) |

### Public
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/artists` | Liste tous les artistes |
| GET | `/api/artists/{slug}` | Détail d'un artiste + vues |
| GET | `/api/artists-list` | Liste simplifiée pour filtres |
| GET | `/api/events` | Liste événements avec filtres |
| GET | `/api/event-locations` | Liste des lieux d'événements |
| GET | `/api/categories` | Liste des catégories |
| POST | `/api/contact` | Envoi formulaire de contact |
| POST | `/api/chatbot` | Message au chatbot IA |

### Artiste (Bearer token requis)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/artist-profile` | Récupère le profil artiste |
| POST | `/api/artist/update` | Met à jour le profil |
| POST | `/api/artist/upload-photo` | Upload photo de profil |
| GET | `/api/artist/stats` | Statistiques de vues |
| GET | `/api/artworks` | Œuvres de l'artiste connecté |
| POST | `/api/artworks/store` | Ajouter une œuvre |
| PUT | `/api/artworks/{id}` | Modifier une œuvre |
| DELETE | `/api/artworks/{id}` | Supprimer une œuvre |
| GET | `/api/artist/events` | Événements de l'artiste |
| POST | `/api/artist/events/store` | Créer un événement |
| PUT | `/api/artist/events/{id}` | Modifier un événement |
| DELETE | `/api/artist/events/{id}` | Supprimer un événement |

### Administration (rôle admin requis)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Statistiques globales |
| GET | `/api/admin/kpis` | Données graphiques KPIs |
| GET | `/api/admin/reporting` | Reporting via vue SQL |
| GET | `/api/admin/suppression-log` | Log suppressions via trigger SQL |
| GET | `/api/admin/artists` | Liste artistes |
| PUT | `/api/admin/artists/{id}` | Modifier un artiste |
| DELETE | `/api/admin/artists/{id}` | Supprimer un artiste |
| GET | `/api/admin/artworks` | Liste œuvres |
| PUT | `/api/admin/artworks/{id}` | Modifier une œuvre |
| DELETE | `/api/admin/artworks/{id}` | Supprimer une œuvre |
| GET | `/api/admin/events` | Liste événements |
| POST | `/api/admin/events` | Créer un événement |
| PUT | `/api/admin/events/{id}` | Modifier un événement |
| DELETE | `/api/admin/events/{id}` | Supprimer un événement |

---


## Fonctionnalités avancées SQL

Le projet utilise des objets SQL avancés créés via les migrations Laravel :

- **Vue SQL** `artistes_stats_vue` — agrège en une seule requête les vues totales, vues sur 30 jours, nombre d'œuvres et d'événements par artiste
- **Procédure stockée** `view_artist()` — crée ou recrée la vue à la demande
- **Trigger** `trg_log_artiste_suppression` — enregistre automatiquement dans `artistes_suppression_log` chaque suppression d'artiste avant qu'elle ne soit exécutée

---

## Auteur

Développé par **Wiam El Khoumari**  
LinkedIn : [wiam-elkhoumari](https://www.linkedin.com/in/wiam-elkhoumari-b28343399/)  
Facebook : [ARTISTA](https://www.facebook.com/profile.php?id=61584894126989)

---

*© 2025 ARTISTA. Tous droits réservés.*
