import React, { useEffect, useState } from 'react';
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

// ─────────────────────────────────────────────────────────────────────
// Modal de confirmation suppression ÉVÉNEMENT (même style qu'œuvre)
// ─────────────────────────────────────────────────────────────────────
import { X, Trash2, AlertTriangle } from 'lucide-react';

function DeleteEventModal({ event, locale, onCancel, onConfirm, deleting }) {
  const title =
    event?.title?.[locale] ||
    event?.title?.fr ||
    (typeof event?.title === 'string' ? event.title : 'cet événement');

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9100,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)', padding: 20,
      }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div style={{
        background: '#fff', borderRadius: 24,
        width: '100%', maxWidth: 440,
        boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '22px 24px 0',
        }}>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0,
          }}>
            Supprimer l'événement
          </h3>
          <button onClick={onCancel} style={{
            background: 'rgba(0,0,0,0.06)', border: 'none',
            borderRadius: '50%', width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <X size={18} color="#666" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'rgba(229,57,53,0.05)',
            border: '1px solid rgba(229,57,53,0.12)',
            borderRadius: 14, padding: '14px 16px', marginBottom: 16,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(229,57,53,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <AlertTriangle size={20} color="#e53935" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>
                « {title} »
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#aaa' }}>
                {event?.venue_name || ''} · ID #{event?.id}
              </p>
            </div>
          </div>
          <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Confirmer la suppression définitive ? Cette action est{' '}
            <strong>irréversible</strong>.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          padding: '20px 24px 24px',
        }}>
          <button
            onClick={onCancel}
            disabled={deleting}
            style={{
              padding: '11px 22px', background: 'transparent',
              border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: 12,
              color: '#888', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit',
              opacity: deleting ? 0.5 : 1,
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{
              padding: '11px 26px',
              background: deleting
                ? '#f5a5a5'
                : 'linear-gradient(135deg, #e53935, #ef5350)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: deleting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {deleting ? (
              <>
                <span style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.6s linear infinite',
                }} />
                Suppression...
              </>
            ) : (
              <><Trash2 size={15} /> Confirmer</>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Dashboard principal
// ─────────────────────────────────────────────────────────────────────
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

  // ── État pour le modal suppression événement ──
  const [deleteEventTarget, setDeleteEventTarget] = useState(null);
  const [deletingEvent,     setDeletingEvent]     = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [artRes, statsRes, evRes, catRes] = await Promise.allSettled([
        api.get('/api/artworks'),
        api.get('/api/artist/stats'),
        api.get('/api/artist/events'),
        api.get('/api/categories'),
      ]);

      if (artRes.status   === 'fulfilled')
        setArtworks(Array.isArray(artRes.value.data)   ? artRes.value.data   : []);
      if (statsRes.status === 'fulfilled')
        setStats(statsRes.value.data || { total_views: 0 });
      if (evRes.status    === 'fulfilled')
        setEvents(Array.isArray(evRes.value.data)      ? evRes.value.data    : []);
      if (catRes.status   === 'fulfilled')
        setCategories(Array.isArray(catRes.value.data) ? catRes.value.data   : []);

    } catch (e) {
      console.error('Erreur dashboard critique', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'artiste' || user?.role === 'admin') fetchAll();
  }, [user]);

  // ── Suppression œuvre ─────────────────────────────────────────────
  // Plus de window.confirm ici : ArtworkTable gère son propre modal.
  // Cette fonction est appelée APRÈS confirmation dans le modal.
  const handleDeleteArtwork = async (id) => {
    try {
      await api.delete(`/api/artworks/${id}`);
      setArtworks(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // ── Suppression événement : ouvre le modal custom ─────────────────
  // EventTable appelle onDelete(id) → on cherche l'event complet
  // pour l'afficher dans le modal, puis on attend la confirmation.
  const handleDeleteEvent = (id) => {
    const ev = events.find(e => e.id === id);
    if (ev) setDeleteEventTarget(ev);
  };

  const handleConfirmDeleteEvent = async () => {
    if (!deleteEventTarget) return;
    setDeletingEvent(true);
    try {
      await api.delete(`/api/artist/events/${deleteEventTarget.id}`);
      setEvents(prev => prev.filter(e => e.id !== deleteEventTarget.id));
      setDeleteEventTarget(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingEvent(false);
    }
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

        {/* ── Modals ajout ── */}
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

        {/* ── Modal suppression événement ── */}
        {deleteEventTarget && (
          <DeleteEventModal
            event={deleteEventTarget}
            locale={locale}
            onCancel={() => setDeleteEventTarget(null)}
            onConfirm={handleConfirmDeleteEvent}
            deleting={deletingEvent}
          />
        )}

        {/* ── Header ── */}
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

        {/* ── Stats ── */}
        <StatsGrid
          stats={stats}
          artworksCount={artworks.length}
          eventsCount={events.length}
          t={t}
        />

        {/* ── Tabs ── */}
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

        {/* ── Tables ── */}
        <div style={DS.tableCard}>
          {activeTab === 'artworks' ? (
            <ArtworkTable
              artworks={artworks}
              loading={loading}
              locale={locale}
              t={t}
              categories={categories}
              onDelete={handleDeleteArtwork}   // appelé après confirmation dans le modal
              onAddClick={() => setShowAddArtwork(true)}
            />
          ) : (
            <EventTable
              events={events}
              locale={locale}
              onDelete={handleDeleteEvent}     // ouvre le modal custom ci-dessus
              onAddClick={() => setShowAddEvent(true)}
              onRefresh={fetchAll}
            />
          )}
        </div>

      </div>
    </div>
  );
}
