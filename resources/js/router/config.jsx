import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Imports Pages
import HomePage from '../pages/home/page.jsx';
import ArtistesPage from '../pages/artistes/PageArtistes.jsx';
import ArtisteDetail from '../pages/artistes/detail.jsx';
import EventsPage from "../pages/evenements/EventsPage.jsx";
import Login from '../pages/connexion/login.jsx';
import Inscription from '../pages/connexion/inscription.jsx';
import ForgotPassword from '../pages/connexion/ForgotPassword.jsx';
import ResetPassword from '../pages/connexion/ResetPassword.jsx';
import NotFound from '../pages/NotFound.jsx';

// Dashboards et Sécurité
import PrivateRoute from '../pages/connexion/PrivateRoute.jsx';
import Profile from '../pages/Dashboard/Profile.jsx';
import Dashboard from '../pages/Dashboard/ArtistDashboard.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';


export default function RouterConfig() {
  return (
    <Routes>
      {/* --- ROUTES PUBLIQUES --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/artistes" element={<ArtistesPage />} />
      <Route path="/artistes/:slug" element={<ArtisteDetail />} />
      <Route path="/event" element={<EventsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* --- ROUTES PROTÉGÉES (ARTISTES & ADMIN) --- */}
      <Route element={<PrivateRoute allowedRoles={['artiste', 'admin']} />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/artist/dashboard" element={<Dashboard />} />
      </Route>

      {/* --- ROUTES RÉSERVÉES ADMIN --- */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}