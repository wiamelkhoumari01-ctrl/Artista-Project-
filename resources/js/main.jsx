import './bootstrap.js';
import axios from 'axios';
import '../css/main.css';
import '../css/contact.css';
import '../css/Footer.css';
import '../css/login.css';
import '../css/inscription.css';
import '../css/ArtistBiosSection.css';
import '../css/temoignageSection.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// L'adresse de ton serveur Laravel
axios.defaults.baseURL = 'http://127.0.0.1:8000'; 
// Pour gérer les sessions/cookies (important pour Sanctum)
axios.defaults.withCredentials = true;
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}