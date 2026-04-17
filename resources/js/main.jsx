import './bootstrap.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// --- IMPORTS DES STYLES ---
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/main.css';
import '../css/contact.css';
import '../css/Footer.css';
import '../css/login.css';
import '../css/inscription.css';
import '../css/ArtistBiosSection.css';
import '../css/temoignageSection.css';
import "../css/Profile.module.css";
import "../css/AdminKpis.css";


const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}