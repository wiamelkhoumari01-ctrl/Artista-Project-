import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext"; 
import "../../../css/events.css";
import { motion } from "framer-motion"; // Ajout de Framer Motion

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [activeType, setActiveType] = useState("Tous");
    const [loading, setLoading] = useState(true);
    const { locale } = useLanguage(); 

    useEffect(() => {
        setLoading(true);
        const cleanLocale = locale.toLowerCase();
        axios.get(`http://127.0.0.1:8000/api/events?locale=${cleanLocale}&type=${activeType}` , { 
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'  
            }
        })
        .then(res => {
            setEvents(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erreur de chargement", err);
            setLoading(false);
        });
    }, [locale, activeType]); 

    return (
        <div className="ev-wrapper">
            <header className="ev-hero-banner">
                <div className="ev-hero-overlay">
                    <h1>Tournées & Événements</h1>
                    <p>Découvrez les prochaines expositions, concerts et rencontres de nos artistes.</p>
                    <button className="ev-main-btn">Explorer les tournées</button>
                </div>

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

            <div className="container ev-content-area">
                <h2 className="ev-section-title">Programmation Culturelle</h2>
                
                <div className="ev-stack">
                    {loading ? (
                        <div className="ev-loading text-center mt-5">
                             <div className="spinner-border text-warning" role="status"></div>
                             <p className="mt-2">Chargement des événements...</p>
                        </div>
                    ) : events.length > 0 ? (
                        events.map((event, index) => ( // Ajout de l'index pour le délai
                            <motion.div 
                                className="ev-item-card" 
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }} // Animation latérale fluide
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="ev-card-body">
                                    <div className="ev-card-header">
                                        <h3>{event.title}</h3>
                                        <span className={`ev-status-badge ${event.status?.class}`}>
                                            {event.status?.label}
                                        </span>
                                    </div>

                                    <div className="ev-participants-info">
                                        <i className="fas fa-users"></i> 
                                        <strong>Artistes :</strong> {event.participants || "Collectif"}
                                    </div>

                                    <p className="ev-description">{event.description}</p>
                                    
                                    <div className="ev-location-info">
                                        <i className="fas fa-map-marker-alt"></i> {event.venue}
                                    </div>
                                </div>

                                <div className="ev-card-date-box">
                                    <span className="ev-date-start">{event.start_date}</span>
                                    <span className="ev-date-end">au {event.end_date}</span>
                                </div>
                            </motion.div>
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