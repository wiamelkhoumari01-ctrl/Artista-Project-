import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importations adaptées à ta nouvelle structure de dossiers
import HomePage from '../pages/home/page.jsx';
import ArtistesPage from '../pages/artistes/PageArtistes.jsx'; // index.js est ta liste complète
import ArtisteDetail from '../pages/artistes/detail.jsx'; // detail.js est ton profil
import EventsPage from "../pages/evenements/EventsPage.jsx"
import Login from '../pages/connexion/login.jsx';
import Inscription from '../pages/connexion/inscription.jsx';
import ForgotPassword from '../pages/connexion/ForgotPassword.jsx';
import Profile from '../pages/dashboard/Profile.jsx';
import ResetPassword from '../pages/connexion/ResetPassword.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function RouterConfig() {
  return (
    <Routes>
      {/* Route d'accueil */}
      <Route path="/" element={<HomePage />} />

      {/* Liste de tous les artistes */}
      <Route path="/artistes" element={<ArtistesPage />} />

      {/* DÉTAIL ARTISTE : 
          On remplace :id par :slug pour correspondre à ta table artist_translations 
      */}
      <Route path="/artistes/:slug" element={<ArtisteDetail />} />
      <Route path="/event" element={<EventsPage />} />

      {/* Authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />
      {/* Page 404 - Toujours en dernier */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}