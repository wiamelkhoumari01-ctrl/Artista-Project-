import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import api from '../../api'; 
import { useLanguage } from '../../context/LanguageContext';
import '../../../css/admin-dashboard.css';

export default function AdminDashboard() {
    const { locale } = useLanguage();
    
    const [stats, setStats] = useState({ total_artists: 0, total_artworks: 0, total_events: 0 });
    const [artists, setArtists] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ type: '', action: '', data: null });
    
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', phone: '', country: '',
        title: '', start_date: '', end_date: '', location_url: '', 
        description: '', artist_id: '', category_id: '', image_url: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [s, a, art, ev] = await Promise.all([
                api.get('/api/admin/stats').catch(() => ({ data: { total_artists: 0, total_artworks: 0, total_events: 0 } })),
                api.get(`/api/admin/artists?lang=${locale}`).catch(() => ({ data: [] })),
                api.get(`/api/admin/artworks?lang=${locale}`).catch(() => ({ data: [] })),
                api.get(`/api/admin/events?lang=${locale}`).catch(() => ({ data: [] }))
            ]);
            
            setStats(s.data || { total_artists: 0, total_artworks: 0, total_events: 0 });
            setArtists(Array.isArray(a.data) ? a.data : []);
            setArtworks(Array.isArray(art.data) ? art.data : []);
            setEvents(Array.isArray(ev.data) ? ev.data : []);
        } catch (e) {
            console.error("Erreur critique de chargement:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [locale]);

    const openModal = (type, action, item = null) => {
        setModalConfig({ type, action, data: item });
        if (item) {
            setFormData({
                first_name: item.artist?.artist_translations?.[0]?.first_name || '',
                last_name: item.artist?.artist_translations?.[0]?.last_name || '',
                email: item.email || '',
                phone: item.artist?.phone || '',
                country: item.artist?.country || '',
                // Utilisation des clés renvoyées par le controller Laravel (with)
                title: item.artwork_translations?.[0]?.title || item.event_translations?.[0]?.title || '',
                description: item.artwork_translations?.[0]?.description || item.event_translations?.[0]?.description || '',
                start_date: item.start_date || '',
                end_date: item.end_date || '',
                location_url: item.location_url || '',
                artist_id: item.artist_id || '',
                category_id: item.category_id || '',
                image_url: item.image_url || ''
            });
        } else {
            setFormData({ first_name: '', last_name: '', email: '', phone: '', country: '', title: '', description: '', start_date: '', end_date: '', location_url: '', artist_id: '', category_id: '', image_url: '' });
        }
        setShowModal(true);
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        const { type, action, data: item } = modalConfig;
        const endpoint = `/api/admin/${type}s`;
        
        // Préparation du payload avec gestion de l'image par défaut pour les œuvres
        const payload = { 
            ...formData, 
            locale,
            image_url: formData.image_url || (type === 'artwork' ? 'https://via.placeholder.com/300' : '') 
        };

        try {
            if (action === 'Supprimer') {
                await api.delete(`${endpoint}/${item.id}`);
            } else if (action === 'Modifier') {
                await api.put(`${endpoint}/${item.id}`, payload);
            } else {
                await api.post(endpoint, payload);
            }
            setShowModal(false);
            loadData();
        } catch (e) {
            alert("Erreur lors de l'opération. Vérifiez les champs obligatoires.");
        }
    };

    const generateArtistsPDF = () => {
        const doc = new jsPDF();
        doc.text("ARTISTA - Liste des Artistes", 14, 20);
        autoTable(doc, {
            startY: 30,
            head: [["Nom Complet", "Email", "Téléphone", "Pays"]],
            body: artists.map(u => [
                `${u.artist?.artist_translations?.[0]?.first_name || ''} ${u.artist?.artist_translations?.[0]?.last_name || ''}`,
                u.email,
                u.artist?.phone || 'N/A',
                u.artist?.country || 'N/A'
            ]),
            styles: { fillColor: [197, 160, 89] },
        });
        doc.save("artistes.pdf");
    };

    if (loading) return <div className="admin-loading">Chargement...</div>;

    return (
        <div className="admin-layout">
            <main className="admin-main">
                <header className="admin-topbar">
                    <h1>Dashboard Administration</h1>
                    <span className="badge-lang">{locale.toUpperCase()}</span>
                </header>

                <div className="cards">
                    <div className="card"><h3>{stats.total_artists || 0}</h3><p>Artistes</p></div>
                    <div className="card"><h3>{stats.total_artworks || 0}</h3><p>Œuvres</p></div>
                    <div className="card"><h3>{stats.total_events || 0}</h3><p>Événements</p></div>
                </div>

                <section className="table-section">
                    <div className="section-header">
                        <h2>Artistes inscrits</h2>
                        <button onClick={generateArtistsPDF} className="btn-pdf-classic">Export PDF</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom Complet</th>
                                <th>Email</th>
                                <th>Téléphone</th>
                                <th>Pays</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {artists.length > 0 ? artists.map(u => (
                                <tr key={u.id}>
                                    <td>{u.artist?.artist_translations?.[0]?.first_name} {u.artist?.artist_translations?.[0]?.last_name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.artist?.phone || '-'}</td>
                                    <td>{u.artist?.country || '-'}</td>
                                    <td className="actions-cell">
                                        <button className="btn-action" onClick={() => openModal('artist', 'Modifier', u)}>Modifier</button>
                                        <button className="btn-action delete" onClick={() => openModal('artist', 'Supprimer', u)}>Supprimer</button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="5" style={{textAlign:'center'}}>Aucun artiste trouvé.</td></tr>}
                        </tbody>
                    </table>
                </section>

                <section className="table-section">
                    <div className="section-header">
                        <h2>Œuvres publiées</h2>
                        <button className="btn-add-main" onClick={() => openModal('artwork', 'Ajouter')}>+ Ajouter</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Titre</th>
                                <th>Catégorie</th>
                                <th>Artiste</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {artworks.length > 0 ? artworks.map(w => (
                                <tr key={w.id}>
                                    <td><img src={w.image_url || 'https://via.placeholder.com/40'} alt="" className="img-thumb" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} /></td>
                                    <td>{w.artwork_translations?.[0]?.title || 'Sans titre'}</td>
                                    <td>{w.category?.category_translations?.[0]?.name || '-'}</td>
                                    <td>{w.artist?.artist_translations?.[0]?.stage_name || 'Inconnu'}</td>
                                    <td className="actions-cell">
                                        <button className="btn-action" onClick={() => openModal('artwork', 'Modifier', w)}>Modifier</button>
                                        <button className="btn-action delete" onClick={() => openModal('artwork', 'Supprimer', w)}>Supprimer</button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="5" style={{textAlign:'center'}}>Aucune œuvre trouvée.</td></tr>}
                        </tbody>
                    </table>
                </section>

                <section className="table-section">
                    <div className="section-header">
                        <h2>Événements</h2>
                        <button className="btn-add-main" onClick={() => openModal('event', 'Ajouter')}>+ Créer</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Début</th>
                                <th>Fin</th>
                                <th>Lieu</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.length > 0 ? events.map(e => (
                                <tr key={e.id}>
                                    <td>{e.event_translations?.[0]?.title || 'Sans titre'}</td>
                                    <td>{e.start_date}</td>
                                    <td>{e.end_date}</td>
                                    <td><a href={e.location_url} target="_blank" rel="noreferrer" className="link-map">Lien</a></td>
                                    <td className="actions-cell">
                                        <button className="btn-action" onClick={() => openModal('event', 'Modifier', e)}>Modifier</button>
                                        <button className="btn-action delete" onClick={() => openModal('event', 'Supprimer', e)}>Supprimer</button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="5" style={{textAlign:'center'}}>Aucun événement trouvé.</td></tr>}
                        </tbody>
                    </table>
                </section>
            </main>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <form onSubmit={handleConfirm}>
                            <div className="modal-header"><h3>{modalConfig.action} {modalConfig.type}</h3></div>
                            <div className="modal-body">
                                {modalConfig.action === 'Supprimer' ? (
                                    <p className="delete-text">Confirmer la suppression définitive ?</p>
                                ) : (
                                    <div className="admin-form">
                                        {modalConfig.type === 'artist' && (
                                            <>
                                                <div className="form-group"><label>Prénom</label><input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required/></div>
                                                <div className="form-group"><label>Nom</label><input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required/></div>
                                                <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required/></div>
                                                <div className="form-group"><label>Téléphone</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                                                <div className="form-group"><label>Pays</label><input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} /></div>
                                            </>
                                        )}
                                        {modalConfig.type === 'artwork' && (
                                            <>
                                                <div className="form-group"><label>Titre</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required/></div>
                                                <div className="form-group"><label>ID Artiste</label><input type="number" value={formData.artist_id} onChange={e => setFormData({...formData, artist_id: e.target.value})} required/></div>
                                                <div className="form-group"><label>ID Catégorie</label><input type="number" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required/></div>
                                                <div className="form-group"><label>URL Image</label><input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..."/></div>
                                            </>
                                        )}
                                        {modalConfig.type === 'event' && (
                                            <>
                                                <div className="form-group"><label>Titre</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required/></div>
                                                <div className="form-group"><label>Début</label><input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required/></div>
                                                <div className="form-group"><label>Fin</label><input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required/></div>
                                                <div className="form-group"><label>URL Google Maps</label><input type="text" value={formData.location_url} onChange={e => setFormData({...formData, location_url: e.target.value})} /></div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                <button type="submit" className={`btn-primary ${modalConfig.action === 'Supprimer' ? 'btn-danger' : ''}`}>Confirmer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}