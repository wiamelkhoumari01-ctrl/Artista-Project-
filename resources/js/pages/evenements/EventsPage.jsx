import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext"; // Import du contexte global
import "../../../css/events.css";

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [activeType, setActiveType] = useState("Tous");
    const [loading, setLoading] = useState(true);
    
    // On récupère la langue globale ici au lieu d'un useState local
    const { locale } = useLanguage(); 

    useEffect(() => {
        setLoading(true);
        // L'appel API utilise maintenant 'locale' venant du contexte
        axios.get(`/api/events?locale=${locale}&type=${activeType}`)
            .then(res => {
                setEvents(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur de chargement", err);
                setLoading(false);
            });
            
        // Le useEffect se relance dès que 'locale' ou 'activeType' change
    }, [locale, activeType]); 

    return (
        <div className="ev-wrapper">
            {/* HERO SECTION */}
            <header className="ev-hero-banner">
                <div className="ev-hero-overlay">
                    <h1>Tournées & Événements</h1>
                    <p>Découvrez les prochaines expositions, concerts et rencontres de nos artistes.</p>
                    <button className="ev-main-btn">Explorer les tournées</button>
                </div>

                {/* BARRE DE TRI GLASSMORPHISM RESPONSIVE */}
                <div className="ev-glass-filter shadow">
                    <div className="ev-filter-group">
                        <div className="ev-pills-container">
                            {["Tous", "Expositions", "Concerts", "Ateliers", "Festivals"].map(t => (
                                <button 
                                    key={t} 
                                    className={`pill-btn ${activeType === t ? 'active' : ''}`}
                                    onClick={() => setActiveType(t)}
                                >
                                    {t === "Tous" && <i className="fas fa-search me-2"></i>}
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="ev-divider-v"></div>

                    <div className="ev-search-group">
                        <select className="ev-minimal-select"><option>Ville</option></select>
                        <span className="ev-sep">|</span>
                        <select className="ev-minimal-select"><option>Date</option></select>
                        <span className="ev-sep">|</span>
                        <select className="ev-minimal-select"><option>Artiste</option></select>
                    </div>
                </div>
            </header>

            {/* LISTE DES ÉVÉNEMENTS */}
            <div className="container ev-content-area">
                <h2 className="ev-section-title">Tournées des Artistes</h2>
                
                <div className="ev-stack">
                    {loading ? (
                        <div className="ev-loading text-center mt-5">
                             <div className="spinner-border text-warning" role="status"></div>
                             <p className="mt-2">Chargement des événements...</p>
                        </div>
                    ) : events.length > 0 ? (
                        events.map(event => (
                            <div className="ev-item-card shadow-sm" key={event.id}>
                                <div className="ev-item-details">
                                    <div className="d-flex align-items-center gap-3">
                                        <h3>{event?.title}</h3>
                                        <span className={`ev-badge ${event?.status?.class}`}>
                                            {event?.status?.label}
                                        </span>
                                    </div>
                                    <div className="ev-artist-info">
                                        <i className="fas fa-user-circle"></i> {event?.artist_name}
                                    </div>
                                    <p className="ev-description-text">{event?.description}</p>
                                </div>
                                <div className="ev-item-dates">
                                    <span className="ev-date-main">{event?.start_date}</span>
                                    <span className="ev-date-range">{event?.end_date}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center mt-5 no-results">
                            <i className="fas fa-calendar-times fa-3x mb-3 text-muted"></i>
                            <p>Aucun événement trouvé pour la langue "{locale.toUpperCase()}".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}