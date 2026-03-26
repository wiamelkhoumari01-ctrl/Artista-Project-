import React, { useEffect, useState } from 'react';
import api from '../../api'; 
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Eye, MousePointerClick, Image as ImageIcon, Plus, Edit3, Trash2, Calendar, LayoutDashboard } from 'lucide-react';
import PopularityChart from './PopularityChart';

export default function Dashboard() {
    const { user } = useAuth();
    const [artworks, setArtworks] = useState([]);
    const [stats, setStats] = useState({ total_views: 0, total_clicks: 0, chart_data: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Récupération simultanée des œuvres et des statistiques
                const [artworksRes, statsRes] = await Promise.all([
                    api.get('/api/artworks'),
                    api.get('/api/artist/stats')
                ]);
                
                setArtworks(artworksRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Erreur chargement dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'artiste' || user?.role === 'admin') fetchDashboardData();
    }, [user]);

    if (!user || (user.role !== 'artiste' && user.role !== 'admin')) {
        return <div className="admin-loader">Accès restreint aux artistes.</div>;
    }

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette œuvre ?")) {
            try {
                await api.delete(`/api/artworks/${id}`);
                setArtworks(artworks.filter(art => art.id !== id));
            } catch (error) {
                console.error("Erreur suppression", error);
            }
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header d-flex justify-content-between align-items-end mb-5">
                <div>
                    <p className="text-muted mb-1 text-uppercase small letter-spacing-2">Gestion de Galerie</p>
                    <h1 className="m-0 text-serif">Tableau de Bord</h1>
                </div>
                <Link to="/add-artwork" className="btn-pdf">
                    <Plus size={18} /> Ajouter une œuvre
                </Link>
            </header>

            {/* Section des statistiques principales */}
            <div className="stats-grid mb-4">
                <div className="stat-card">
                    <Eye className="mb-2" size={24} color="#c5a059" />
                    <h3>{stats.total_views}</h3>
                    <p className="text-muted small text-uppercase fw-bold">Vues Profil</p>
                </div>
                <div className="stat-card">
                    <MousePointerClick className="mb-2" size={24} color="#c5a059" />
                    <h3>{stats.total_clicks}</h3>
                    <p className="text-muted small text-uppercase fw-bold">Clics Réseaux</p>
                </div>
                <div className="stat-card">
                    <ImageIcon className="mb-2" size={24} color="#c5a059" />
                    <h3>{artworks.length}</h3>
                    <p className="text-muted small text-uppercase fw-bold">Œuvres Exposées</p>
                </div>
                <div className="stat-card">
                    <LayoutDashboard className="mb-2" size={24} color="#c5a059" />
                    <h3 style={{fontSize: '1.5rem', marginTop: '1.2rem'}}>Actif</h3>
                    <p className="text-muted small text-uppercase fw-bold">Statut Compte</p>
                </div>
            </div>

            {/* Section du graphique d'évolution */}
            <section className="admin-section mb-5">
                <PopularityChart data={stats.chart_data} />
            </section>

            {/* Section de la collection d'œuvres */}
            <section className="admin-section">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-serif m-0">Ma Collection</h2>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="admin-loader">Chargement de la galerie...</div>
                    </div>
                ) : artworks.length > 0 ? (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Aperçu</th>
                                    <th>Titre de l'œuvre</th>
                                    <th>Date de Publication</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {artworks.map((art) => (
                                    <tr key={art.id}>
                                        <td>
                                            <div className="img-container-admin">
                                                <img src={art.image_url} alt={art.title} className="admin-img-preview" />
                                            </div>
                                        </td>
                                        <td>
                                            <span className="fw-bold text-dark d-block">{art.title}</span>
                                            <span className="text-muted small">ID: #{art.id}</span>
                                        </td>
                                        <td>{new Date(art.date_creation || Date.now()).toLocaleDateString('fr-FR')}</td>
                                        <td className="text-end">
                                            <button className="btn-view" title="Modifier">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="btn-delete" title="Supprimer" onClick={() => handleDelete(art.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <ImageIcon size={48} className="text-muted mb-3 opacity-25" />
                        <p className="text-muted">Votre galerie est vide pour le moment.</p>
                        <Link to="/add-artwork" className="text-gold fw-bold">Publier votre première œuvre</Link>
                    </div>
                )}
            </section>
        </div>
    );
}