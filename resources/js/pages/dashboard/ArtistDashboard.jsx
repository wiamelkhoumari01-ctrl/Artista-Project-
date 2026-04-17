import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Calendar, ImageIcon } from 'lucide-react';
import StatsGrid from './components/StatsGrid';
import ArtworkTable from './components/ArtworkTable';
import EventTable from './components/EventTable';
import AddArtworkModal from './components/AddArtworkModal';
import AddEventModal from './components/AddEventModal';
import { DS } from './styles/dashboardStyles';

export default function Dashboard() {
  const { user }      = useAuth();
  const { t, locale } = useLanguage();

  const [artworks,   setArtworks]   = useState([]);
  const [events,     setEvents]     = useState([]);
  const [stats,      setStats]      = useState({ total_views: 0 });
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState('artworks');

  const [showAddArtwork, setShowAddArtwork] = useState(false);
  const [showAddEvent,   setShowAddEvent]   = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [artRes, statsRes, evRes, catRes] = await Promise.allSettled([
        api.get('/api/artworks'),
        api.get('/api/artist/stats'),
        api.get('/api/artist/events'),
        api.get('/api/categories'),
      ]);

      if (artRes.status === 'fulfilled')
        setArtworks(Array.isArray(artRes.value.data) ? artRes.value.data : []);

      if (statsRes.status === 'fulfilled')
        setStats(statsRes.value.data || { total_views: 0 });

      if (evRes.status === 'fulfilled')
        setEvents(Array.isArray(evRes.value.data) ? evRes.value.data : []);

      if (catRes.status === 'fulfilled')
        setCategories(Array.isArray(catRes.value.data) ? catRes.value.data : []);

      [artRes, statsRes, evRes, catRes].forEach((r, i) => {
        if (r.status === 'rejected') {
          const names = ['artworks', 'stats', 'events', 'categories'];
          console.warn(`[Dashboard] ${names[i]} failed:`, r.reason?.message);
        }
      });

    } catch (e) {
      console.error("Erreur dashboard critique", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'artiste' || user?.role === 'admin') fetchAll();
  }, [user]);

  const handleDeleteArtwork = async (id) => {
    if (!window.confirm(t('dashboard.confirm_delete'))) return;
    try {
      await api.delete(`/api/artworks/${id}`);
      setArtworks(prev => prev.filter(a => a.id !== id));
    } catch (e) { console.error(e); }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Supprimer cet événement définitivement ?')) return;
    try {
      await api.delete(`/api/artist/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (e) { console.error(e); }
  };

  if (!user || (user.role !== 'artiste' && user.role !== 'admin')) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', color: '#999' }}>
        {t('dashboard.restricted_access')}
      </div>
    );
  }

  return (
    <div style={{ background: '#f6efe6', minHeight: '100vh', paddingTop: 100, paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 1100 }}>

        {/* Modals */}
        {showAddArtwork && (
          <AddArtworkModal
            categories={categories}
            locale={locale}
            onClose={() => setShowAddArtwork(false)}
            onSuccess={fetchAll}
          />
        )}
        {showAddEvent && (
          <AddEventModal
            onClose={() => setShowAddEvent(false)}
            onSuccess={fetchAll}
          />
        )}

        {/* Header */}
        <div style={DS.header}>
          <div>
            <p style={DS.headerSub}>{t('dashboard.management_title')}</p>
            <h1 style={DS.headerTitle}>{t('dashboard.page_title')}</h1>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button style={DS.btnGold} onClick={() => setShowAddArtwork(true)}>
              <Plus size={15} /> {t('dashboard.add_artwork')}
            </button>
            <button style={DS.btnOutline} onClick={() => setShowAddEvent(true)}>
              <Calendar size={15} /> Ajouter un événement
            </button>
          </div>
        </div>

        {/* Stats — 3 cards sans clicks */}
        <StatsGrid
          stats={stats}
          artworksCount={artworks.length}
          eventsCount={events.length}
          t={t}
        />

        {/* Tabs */}
        <div style={DS.tabBar}>
          {[
            { key: 'artworks', label: `${t('dashboard.collection_title')} (${artworks.length})`, icon: <ImageIcon size={14} /> },
            { key: 'events',   label: `Mes Événements (${events.length})`,                        icon: <Calendar size={14} /> },
          ].map(tab => (
            <button
              key={tab.key}
              style={{ ...DS.tab, ...(activeTab === tab.key ? DS.tabActive : {}) }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tables */}
        <div style={DS.tableCard}>
          {activeTab === 'artworks' ? (
            <ArtworkTable
              artworks={artworks}
              loading={loading}
              locale={locale}
              t={t}
              categories={categories}
              onDelete={handleDeleteArtwork}
              onAddClick={() => setShowAddArtwork(true)}
            />
          ) : (
            <EventTable
              events={events}
              locale={locale}
              onDelete={handleDeleteEvent}
              onAddClick={() => setShowAddEvent(true)}
              onRefresh={fetchAll}
            />
          )}
        </div>

      </div>
    </div>
  );
}