import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../../context/LanguageContext';


export default function EventsTimeline() {
  const { locale } = useLanguage();
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/events', {
      params: { locale: locale.toLowerCase(), type: 'Tous' }
    })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setEvents(data.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [locale]);

  // Pendant le chargement : placeholder avec hauteur fixe
  // pour que le layout soit stable quand HashLink calcule la position
  if (loading) {
    return (
      <section
        className="ev-timeline-section"
        style={{ minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="spinner-border" style={{ color: '#e67e22' }} />
      </section>
    );
  }

  if (events.length === 0) return null;

  const getStatusLabel = (label) => {
    if (locale !== 'ar') return label;
    const tr = { 'Terminé': 'منتهي', 'À venir': 'قادم', 'En cours': 'جاري' };
    return tr[label] || label;
  };

  const getT = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') return field[locale] || field.fr || field.en || '';
    return '';
  };

  return (
    <section
      className="ev-timeline-section"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      style={{ position: 'relative', zIndex: 0 }}
    >
      <div className="container">
        <div className="ev-timeline-header">
          <span className="ev-timeline-label">
            {locale === 'ar' ? 'الأحداث' : 'PLANNING'}
          </span>
          <h2 className="ev-timeline-title">
            {locale === 'ar' ? 'جولات & فعاليات'
              : locale === 'en' ? 'Tours & Events'
              : 'Tournées & Événements'}
          </h2>
          <p className="ev-timeline-subtitle">
            {locale === 'ar' ? 'اكتشف المعارض والأحداث الفنية القادمة'
              : locale === 'en' ? 'Discover upcoming exhibitions and artistic events'
              : 'Découvrez les prochaines expositions et événements artistiques'}
          </p>
        </div>

        <div className="ev-timeline-track">
          <div className="ev-timeline-line" />
          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            const status = event.status;
            return (
              <div key={event.id} className={`ev-tl-item ${isLeft ? 'ev-tl-left' : 'ev-tl-right'}`}>
                <div className="ev-tl-dot" />
                <div className="ev-tl-card">
                  <div className="ev-tl-date-block">
                    <span className="ev-tl-day">
                      {event.start_date ? event.start_date.split(' ')[0] : '—'}
                    </span>
                    <span className="ev-tl-month">
                      {event.start_date ? event.start_date.split(' ').slice(1).join(' ') : ''}
                    </span>
                  </div>
                  <span className={`ev-tl-badge ${status?.class || 'st-upcoming'}`}>
                    {getStatusLabel(status?.label || 'À venir')}
                  </span>
                  <h3 className="ev-tl-title">{getT(event.title)}</h3>
                  {event.venue_name && (
                    <p className="ev-tl-venue">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {event.venue_name}
                    </p>
                  )}
                  {event.description && (
                    <p className="ev-tl-desc">{getT(event.description)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="ev-timeline-cta">
          <Link to="/event" className="ev-tl-btn">
            {locale === 'ar' ? 'عرض جميع الأحداث'
              : locale === 'en' ? 'View all events'
              : 'Voir tous les événements'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}