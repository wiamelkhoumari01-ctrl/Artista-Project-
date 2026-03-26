import React, { useEffect, useState } from 'react';
import api from '../../api'; // Import corrigé
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [artistData, setArtistData] = useState(null);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        const response = await api.get('/api/artist-profile');
        setArtistData(response.data);
      } catch (error) {
        console.error("Erreur profile", error);
      }
    };
    if (user?.role === 'artiste') fetchArtistInfo();
  }, [user]);

  if (user?.role !== 'artiste') {
    return <div className="container mt-5 pt-5">Accès réservé aux artistes.</div>;
  }
  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
            <img 
              src={artistData?.image_url || '/images/default-avatar.png'} 
              className="rounded-circle mx-auto mb-3" 
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              alt="Profil"
            />
            <h3>{artistData?.stage_name || user.first_name}</h3>
            <p className="text-muted">{artistData?.city}, {artistData?.country}</p>
            <button className="btn btn-dark btn-sm rounded-pill">Modifier la photo</button>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h4 className="fw-bold mb-4">À propos de moi</h4>
            <p>{artistData?.bio || "Aucune bio renseignée."}</p>
            <hr />
            <div className="row">
              <div className="col-6"><strong>Ville:</strong> {artistData?.city}</div>
              <div className="col-6"><strong>Site web:</strong> {artistData?.website}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}