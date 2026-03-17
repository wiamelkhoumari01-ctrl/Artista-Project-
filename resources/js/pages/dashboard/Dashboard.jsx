import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                // On récupère les œuvres spécifiques de cet artiste
                const response = await axios.get('http://localhost:8000/api/my-artworks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setArtworks(response.data);
            } catch (error) {
                console.error("Erreur dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'artiste') fetchDashboardData();
    }, [user]);

    if (user?.role !== 'artiste') return <div className="container mt-5 pt-5">Accès non autorisé.</div>;

    return (
        <div className="container mt-5 pt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Tableau de Bord</h2>
                <Link to="/add-artwork" className="btn btn-dark rounded-pill px-4">
                    + Ajouter une œuvre
                </Link>
            </div>

            {/* Cartes de statistiques rapides */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-light text-center">
                        <h4 className="fw-bold mb-0">{artworks.length}</h4>
                        <p className="text-muted small mb-0">Œuvres publiées</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-light text-center">
                        <h4 className="fw-bold mb-0">0</h4>
                        <p className="text-muted small mb-0">Événements à venir</p>
                    </div>
                </div>
            </div>

            {/* Liste des œuvres */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
                <h5 className="fw-bold mb-4">Mes Œuvres</h5>
                {loading ? (
                    <p>Chargement...</p>
                ) : artworks.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Image</th>
                                    <th>Titre</th>
                                    <th>Date</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {artworks.map((art) => (
                                    <tr key={art.id}>
                                        <td>
                                            <img src={art.image_url} alt={art.title} className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                        </td>
                                        <td><strong>{art.title}</strong></td>
                                        <td>{new Date(art.date_creation).toLocaleDateString()}</td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-primary me-2 rounded-pill">Modifier</button>
                                            <button className="btn btn-sm btn-outline-danger rounded-pill">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-muted">Vous n'avez pas encore ajouté d'œuvres.</p>
                    </div>
                )}
            </div>
        </div>
    );
}