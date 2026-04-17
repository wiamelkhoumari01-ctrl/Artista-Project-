import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion"; // Ajout de AnimatePresence pour l'overlay
import "../../../css/events.css";

export default function EventsPage() {
    const [events,    setEvents]    = useState([]);
    const [artists,   setArtists]   = useState([]);
    const [locations, setLocations] = useState([]);
    const [activeType, setActiveType] = useState("Tous");
    const [country,   setCountry]   = useState("");
    const [date,      setDate]      = useState("");
    const [artist,    setArtist]    = useState("");
    const [loading,   setLoading]   = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef(null);

    const { locale, t } = useLanguage();

    const getT = (field) => {
        if (!field) return "";
        if (typeof field === "string") return field;
        if (typeof field === "object") return field[locale] || field.fr || field.en || "";
        return "";
    };

    // Ferme le panneau filtre si clic extérieur
    useEffect(() => {
        const handleClick = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false);
            }
        };
        if (filterOpen) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [filterOpen]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/artists-list?locale=${locale}`)
            .then(res => setArtists(Array.isArray(res.data) ? res.data : []))
            .catch(() => setArtists([]));

        axios.get("http://127.0.0.1:8000/api/event-locations")
            .then(res => setLocations(Array.isArray(res.data) ? res.data : []))
            .catch(() => setLocations([]));
    }, [locale]);

    useEffect(() => {
        setLoading(true);
        axios.get("http://127.0.0.1:8000/api/events", {
            params: {
                locale:  locale.toLowerCase(),
                type:    activeType,
                country: country || undefined,
                date:    date    || undefined,
                artist:  artist  || undefined,
            }
        })
        .then(res => {
            setEvents(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        })
        .catch(() => {
            setEvents([]);
            setLoading(false);
        });
    }, [locale, activeType, country, date, artist]);

    const types = ["Tous", "Expositions", "Concerts", "Ateliers", "Festivals"];

    // Compte les filtres actifs (hors type)
    const activeFiltersCount = [country, date, artist].filter(Boolean).length;

    const resetFilters = () => {
        setCountry('');
        setDate('');
        setArtist('');
        setFilterOpen(false);
    };

    return (
        <div className="ev-wrapper">

            {/* ── Hero ── */}
            <header className="ev-hero-banner">
                <div className="ev-hero-overlay">
                    <h1>{t('events.title')}</h1>
                    <p>{t('events.subtitle')}</p>
                    <button className="ev-main-btn">
                        {locale === 'ar' ? 'الفن في حركة' : locale === 'en' ? 'Art in Motion' : "L'art en mouvement"}
                    </button>
                </div>

                {/* ── Barre de filtre ── */}
                <div className="ev-filter-bar" ref={filterRef}>

                    {/* Pills types — scrollables sur mobile */}
                    <div className="ev-pills-scroll">
                        {types.map(type => (
                            <button
                                key={type}
                                className={`pill-btn ${activeType === type ? 'active' : ''}`}
                                onClick={() => setActiveType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Séparateur vertical */}
                    <div className="ev-bar-sep" />

                    {/* Bouton "Filtres" avec dropdown */}
                    <div className="ev-filter-dropdown-wrap">
                        <button
                            className={`ev-filter-toggle ${filterOpen ? 'open' : ''} ${activeFiltersCount > 0 ? 'has-filters' : ''}`}
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            <i className="fas fa-sliders-h"></i>
                            <span>Filtres</span>
                            {activeFiltersCount > 0 && (
                                <span className="ev-filter-count">{activeFiltersCount}</span>
                            )}
                            <i className={`fas fa-chevron-${filterOpen ? 'up' : 'down'} ev-chevron`}></i>
                        </button>

                        {/* Overlay Mobile (Fond sombre) */}
                        <AnimatePresence>
                            {filterOpen && (
                                <motion.div 
                                    className="ev-filter-overlay-mobile"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setFilterOpen(false)}
                                />
                            )}
                        </AnimatePresence>

                        {/* Panneau dropdown des filtres */}
                        {filterOpen && (
                            <div className="ev-filter-panel">
                                <div className="ev-filter-panel-inner">

                                    {/* Lieu */}
                                    <div className="ev-filter-field">
                                        <label className="ev-filter-label">
                                            <i className="fas fa-map-marker-alt"></i> Lieu
                                        </label>
                                        <select
                                            className="ev-filter-select"
                                            value={country}
                                            onChange={e => setCountry(e.target.value)}
                                        >
                                            <option value="">Tous les lieux</option>
                                            {locations.map((loc, i) => (
                                                <option key={i} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date */}
                                    <div className="ev-filter-field">
                                        <label className="ev-filter-label">
                                            <i className="far fa-calendar-alt"></i> Date
                                        </label>
                                        <input
                                            type="date"
                                            className="ev-filter-select"
                                            value={date}
                                            onChange={e => setDate(e.target.value)}
                                        />
                                    </div>

                                    {/* Artiste */}
                                    <div className="ev-filter-field">
                                        <label className="ev-filter-label">
                                            <i className="fas fa-user"></i> Artiste
                                        </label>
                                        <select
                                            className="ev-filter-select"
                                            value={artist}
                                            onChange={e => setArtist(e.target.value)}
                                        >
                                            <option value="">Tous les artistes</option>
                                            {artists.map(a => (
                                                <option key={a.id} value={a.id}>
                                                    {a.stage_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>

                                {/* Footer du panneau */}
                                <div className="ev-filter-panel-footer">
                                    <button className="ev-reset-btn" onClick={resetFilters}>
                                        Réinitialiser
                                    </button>
                                    <button className="ev-apply-btn" onClick={() => setFilterOpen(false)}>
                                        Appliquer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </header>

            {/* ── Contenu ── */}
            <div className="container ev-content-area">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
                    <h2 className="ev-section-title">Programmation Culturelle</h2>
                    {activeFiltersCount > 0 && (
                        <button className="ev-reset-inline" onClick={resetFilters}>
                            <i className="fas fa-times"></i> Effacer les filtres ({activeFiltersCount})
                        </button>
                    )}
                </div>

                <div className="ev-stack">
                    {loading ? (
                        <div className="ev-loading text-center mt-5">
                            <div className="spinner-border text-warning" role="status"></div>
                            <p className="mt-2">{t('common.loading')}...</p>
                        </div>
                    ) : events.length > 0 ? (
                        events.map((event, index) => (
                            <motion.div
                                className="ev-item-card"
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                            >
                                <div className="ev-card-body">
                                    <div className="ev-card-header">
                                        <h3>{getT(event.title)}</h3>
                                        <span className={`ev-status-badge ${event.status?.class}`}>
                                            {event.status?.label}
                                        </span>
                                    </div>
                                    <div className="ev-participants-info">
                                        <i className="fas fa-users"></i>
                                        <strong> Artistes :</strong> {event.participants || 'Collectif'}
                                    </div>
                                    <p className="ev-description">{getT(event.description)}</p>
                                    <div className="ev-location-info">
                                        <i className="fas fa-map-marker-alt"></i> {event.venue_name}
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
                            <p>{t('common.no_results')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}