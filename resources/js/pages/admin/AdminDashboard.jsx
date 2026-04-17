import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../../api';
import { useLanguage } from '../../context/LanguageContext';
import '../../../css/admin-dashboard.css';

export default function AdminDashboard() {
    const { locale, t } = useLanguage();

    const [stats,      setStats]      = useState({ total_artists: 0, total_artworks: 0, total_events: 0 });
    const [artists,    setArtists]    = useState([]);
    const [artworks,   setArtworks]   = useState([]);
    const [events,     setEvents]     = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [showModal,  setShowModal]  = useState(false);
    const [modalConfig, setModalConfig] = useState({ type: '', action: '', data: null });

    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', phone: '', country: '',
        title: '', description: '', venue_name: '', type: 'Exposition',
        start_date: '', end_date: '', location_url: '', category_id: '',
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [s, a, art, ev, cat] = await Promise.all([
                api.get('/api/admin/stats').catch(() => ({ data: { total_artists: 0, total_artworks: 0, total_events: 0 } })),
                api.get(`/api/admin/artists?lang=${locale}`).catch(() => ({ data: [] })),
                api.get(`/api/admin/artworks?lang=${locale}`).catch(() => ({ data: [] })),
                api.get(`/api/admin/events?lang=${locale}`).catch(() => ({ data: [] })),
                api.get('/api/categories').catch(() => ({ data: [] })),
            ]);
            setStats(s.data || { total_artists: 0, total_artworks: 0, total_events: 0 });
            setArtists(Array.isArray(a.data)   ? a.data   : []);
            setArtworks(Array.isArray(art.data) ? art.data : []);
            setEvents(Array.isArray(ev.data)   ? ev.data  : []);
            setCategories(Array.isArray(cat.data) ? cat.data : []);
        } catch (e) {
            console.error("Erreur chargement:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [locale]);

    const fmtDate = (d) => {
        if (!d) return '';
        try { return new Date(d).toISOString().split('T')[0]; }
        catch { return ''; }
    };

    const openModal = (type, action, item = null) => {
        setModalConfig({ type, action, data: item });
        if (item) {
            setFormData({
                first_name:   item.artist?.artist_translations?.[0]?.first_name || '',
                last_name:    item.artist?.artist_translations?.[0]?.last_name  || '',
                email:        item.email        || '',
                phone:        item.artist?.phone   || '',
                country:      item.artist?.country || '',
                title:        item.artwork_translations?.[0]?.title
                           || item.event_translations?.[0]?.title  || '',
                description:  item.artwork_translations?.[0]?.description
                           || item.event_translations?.[0]?.description || '',
                venue_name:   item.venue_name    || '',
                type:         item.type          || 'Exposition',
                start_date:   fmtDate(item.start_date),
                end_date:     fmtDate(item.end_date),
                location_url: item.location_url  || '',
                category_id:  item.category_id   || '',
            });
        } else {
            setFormData({
                first_name: '', last_name: '', email: '', phone: '', country: '',
                title: '', description: '', venue_name: '', type: 'Exposition',
                start_date: '', end_date: '', location_url: '', category_id: '',
            });
        }
        setShowModal(true);
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        const { type, action, data: item } = modalConfig;
        try {
            if (action === 'Supprimer') {
                await api.delete(`/api/admin/${type}s/${item.id}`);
            } else if (action === 'Modifier') {
                if (type === 'artist') {
                    await api.put(`/api/admin/artists/${item.id}`, {
                        first_name: formData.first_name,
                        last_name:  formData.last_name,
                        email:      formData.email,
                        phone:      formData.phone,
                        country:    formData.country,
                    });
                } else if (type === 'artwork') {
                    await api.put(`/api/admin/artworks/${item.id}`, {
                        title:       { fr: formData.title, en: formData.title, ar: formData.title },
                        description: { fr: formData.description, en: formData.description, ar: formData.description },
                        category_id: formData.category_id,
                    });
                } else if (type === 'event') {
                    await api.put(`/api/admin/events/${item.id}`, {
                        type:        formData.type,
                        title:       { fr: formData.title, en: formData.title, ar: formData.title },
                        description: { fr: formData.description, en: formData.description, ar: formData.description },
                        venue_name:   formData.venue_name,
                        start_date:   formData.start_date,
                        end_date:     formData.end_date,
                        location_url: formData.location_url,
                    });
                }
            }
            setShowModal(false);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de l\'opération.');
        }
    };

    const generateArtistsPDF = () => {
        const doc = new jsPDF();
        doc.text('ARTISTA — Liste des Artistes', 14, 20);
        autoTable(doc, {
            startY: 30,
            head: [['Nom', 'Email', 'Téléphone', 'Pays']],
            body: artists.map(u => [
                `${u.artist?.artist_translations?.[0]?.first_name || ''} ${u.artist?.artist_translations?.[0]?.last_name || ''}`,
                u.email,
                u.artist?.phone   || 'N/A',
                u.artist?.country || 'N/A',
            ]),
            styles: { fillColor: [197, 160, 89] },
        });
        doc.save("artistes.pdf");
    };

    if (loading) return <div className="admin-loading">Chargement...</div>;

    return (
        <div className="admin-layout">
            <main className="admin-main">

                {/* Header */}
                <header className="admin-topbar">
                    <h1>Dashboard Administration</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        
                        <span className="badge-lang">{locale.toUpperCase()}</span>
                        <Link to="/admin/kpis" className="btn-kpi">
                             Monitoring & KPIs
                        </Link>
                    </div>
                </header>

                {/* Stats */}
                <div className="cards">
                    <div className="card"><h3>{stats.total_artists  || 0}</h3><p>Artistes</p></div>
                    <div className="card"><h3>{stats.total_artworks || 0}</h3><p>Œuvres</p></div>
                    <div className="card"><h3>{stats.total_events   || 0}</h3><p>Événements</p></div>
                </div>

                {/* Table Artistes */}
                <section className="table-section">
                    <div className="section-header">
                        <h2>Artistes inscrits</h2>
                        <button onClick={generateArtistsPDF} className="btn-pdf-classic">
                            Export PDF
                        </button>
                    </div>
                    <div className="table-responsive-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom Complet</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>
                                    <th>Pays</th>
                                    <th className="th-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {artists.length > 0 ? artists.map(u => (
                                    <tr key={u.id}>
                                        <td data-label="Nom">
                                            {u.artist?.artist_translations?.[0]?.first_name}{' '}
                                            {u.artist?.artist_translations?.[0]?.last_name}
                                        </td>
                                        <td data-label="Email">{u.email}</td>
                                        <td data-label="Téléphone">{u.artist?.phone || '—'}</td>
                                        <td data-label="Pays">{u.artist?.country || '—'}</td>
                                        <td className="actions-cell">
                                            <button className="btn-action" onClick={() => openModal('artist', 'Modifier', u)}>Modifier</button>
                                            <button className="btn-action delete" onClick={() => openModal('artist', 'Supprimer', u)}>Supprimer</button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="5" className="td-empty">Aucun artiste trouvé.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Table Œuvres */}
                <section className="table-section">
                    <div className="section-header">
                        <h2>Œuvres publiées</h2>
                    </div>
                    <div className="table-responsive-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Catégorie</th>
                                    <th>Artiste</th>
                                    <th className="th-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {artworks.length > 0 ? artworks.map(w => (
                                    <tr key={w.id}>
                                        <td data-label="Titre">{w.artwork_translations?.[0]?.title || '—'}</td>
                                        <td data-label="Catégorie">{w.category?.category_translations?.[0]?.name || '—'}</td>
                                        <td data-label="Artiste">{w.artist?.artist_translations?.[0]?.stage_name || '—'}</td>
                                        <td className="actions-cell">
                                            <button className="btn-action" onClick={() => openModal('artwork', 'Modifier', w)}>Modifier</button>
                                            <button className="btn-action delete" onClick={() => openModal('artwork', 'Supprimer', w)}>Supprimer</button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="5" className="td-empty">Aucune œuvre trouvée.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Table Événements */}
                <section className="table-section">
                    <div className="section-header">
                        <h2>Événements</h2>
                    </div>
                    <div className="table-responsive-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Titre</th>
                                    <th>Lieu</th>
                                    <th>Début</th>
                                    <th>Fin</th>
                                    <th className="th-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length > 0 ? events.map(ev => (
                                    <tr key={ev.id}>
                                        <td data-label="Type">
                                            <span className="type-badge">{ev.type || '—'}</span>
                                        </td>
                                        <td data-label="Titre">{ev.event_translations?.[0]?.title || '—'}</td>
                                        <td data-label="Lieu">{ev.venue_name || '—'}</td>
                                        <td data-label="Début">
                                            {ev.start_date ? new Date(ev.start_date).toLocaleDateString('fr-FR') : '—'}
                                        </td>
                                        <td data-label="Fin">
                                            {ev.end_date ? new Date(ev.end_date).toLocaleDateString('fr-FR') : '—'}
                                        </td>
                                        <td className="actions-cell">
                                            <button className="btn-action" onClick={() => openModal('event', 'Modifier', ev)}>Modifier</button>
                                            <button className="btn-action delete" onClick={() => openModal('event', 'Supprimer', ev)}>Supprimer</button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="6" className="td-empty">Aucun événement trouvé.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal-box">
                        <form onSubmit={handleConfirm}>
                            <div className="modal-header">
                                <h3>
                                    {modalConfig.action === 'Modifier' ? 'Modifier' : 'Supprimer'}{' '}
                                    {modalConfig.type === 'artist' ? 'l\'artiste'
                                        : modalConfig.type === 'artwork' ? 'l\'œuvre'
                                        : 'l\'événement'}
                                </h3>
                                <button type="button" className="modal-close" onClick={() => setShowModal(false)}>×</button>
                            </div>

                            <div className="modal-body">
                                {modalConfig.action === 'Supprimer' ? (
                                    <p className="delete-text">
                                        Confirmer la suppression définitive ? Cette action est irréversible.
                                    </p>
                                ) : (
                                    <div className="admin-form">

                                        {/* ── Artiste ── */}
                                        {modalConfig.type === 'artist' && (
                                            <>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Prénom</label>
                                                        <input type="text" value={formData.first_name}
                                                            onChange={e => setFormData({ ...formData, first_name: e.target.value })} required />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Nom</label>
                                                        <input type="text" value={formData.last_name}
                                                            onChange={e => setFormData({ ...formData, last_name: e.target.value })} required />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input type="email" value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Téléphone</label>
                                                        <input type="text" value={formData.phone}
                                                            onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Pays</label>
                                                        <input type="text" value={formData.country}
                                                            onChange={e => setFormData({ ...formData, country: e.target.value })} />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* ── Œuvre ── */}
                                        {modalConfig.type === 'artwork' && (
                                            <>
                                                <div className="form-group">
                                                    <label>Titre *</label>
                                                    <input type="text" value={formData.title}
                                                        onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Description</label>
                                                    <textarea value={formData.description} rows={3}
                                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                        style={{ resize: 'vertical' }} />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Catégorie</label>
                                                        <select value={formData.category_id}
                                                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                                                            <option value="">-- Sélectionner --</option>
                                                            {categories.map(cat => (
                                                                <option key={cat.id} value={cat.id}>
                                                                    {cat.name?.[locale] || cat.name?.fr || cat.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Date de création</label>
                                                        <input type="date" value={formData.date_creation || ''}
                                                            onChange={e => setFormData({ ...formData, date_creation: e.target.value })} />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* ── Événement ── */}
                                        {modalConfig.type === 'event' && (
                                            <>
                                                <div className="form-group">
                                                    <label>Type de tournée *</label>
                                                    <select value={formData.type}
                                                        onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                                        {['Exposition', 'Atelier', 'Concert', 'Festival'].map(tp => (
                                                            <option key={tp} value={tp}>{tp}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Titre *</label>
                                                    <input type="text" value={formData.title}
                                                        onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Description</label>
                                                    <textarea value={formData.description} rows={3}
                                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                        style={{ resize: 'vertical' }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Lieu *</label>
                                                    <input type="text" value={formData.venue_name}
                                                        onChange={e => setFormData({ ...formData, venue_name: e.target.value })} required />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Date début *</label>
                                                        <input type="date" value={formData.start_date}
                                                            onChange={e => setFormData({ ...formData, start_date: e.target.value })} required />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Date fin *</label>
                                                        <input type="date" value={formData.end_date}
                                                            onChange={e => setFormData({ ...formData, end_date: e.target.value })} required />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Lien Google Maps</label>
                                                    <input type="text" value={formData.location_url}
                                                        onChange={e => setFormData({ ...formData, location_url: e.target.value })}
                                                        placeholder="https://maps.google.com/..." />
                                                </div>
                                            </>
                                        )}

                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit"
                                    className={`btn-primary ${modalConfig.action === 'Supprimer' ? 'btn-danger' : ''}`}>
                                    Confirmer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}