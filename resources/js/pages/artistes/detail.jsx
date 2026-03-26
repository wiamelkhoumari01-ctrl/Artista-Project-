import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; 
import { useLanguage } from "../../context/LanguageContext";
import Timeline from "../../components/ui/Timeline.jsx";
import "../../../css/artist-detail.css";

export default function ArtisteDetail() {
    const { slug } = useParams();
    const { locale } = useLanguage();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtistData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/artists/${slug}?lang=${locale}`);
                const data = response.data;
                const formattedArtist = {
                    stage_name: data.artist_translations?.[0]?.stage_name || "Artiste",
                    bio: data.artist_translations?.[0]?.bio || "",
                    city: data.city || "",
                    country: data.country || "",
                    website: data.website || "",
                    image_url: data.image_url || "/images/default-avatar.png",
                    artworks: data.artworks?.map(art => ({
                        id: art.id,
                        title: art.artwork_translations?.[0]?.title || "Sans titre",
                        image_url: art.image_url,
                        description: art.artwork_translations?.[0]?.description || ""
                    })) || [],
                    events: data.events?.map(ev => ({
                        id: ev.id,
                        title: ev.event_translations?.[0]?.title || "Événement",
                        venue_name: ev.event_translations?.[0]?.venue_name || "",
                        start_date: ev.start_date,
                        description: ev.event_translations?.[0]?.description || ""
                    })) || []
                };
                setArtist(formattedArtist);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtistData();
    }, [slug, locale]);

    // Rendu du Skeleton pendant le chargement
    if (loading) {
        return (
            <div className="artist-detail-page">
                <div className="skeleton" style={{ height: '450px', width: '100%' }}></div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-lg-4"><div className="skeleton" style={{ height: '300px', borderRadius: '20px' }}></div></div>
                        <div className="col-lg-8"><div className="skeleton" style={{ height: '500px', borderRadius: '20px' }}></div></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!artist) return <div className="text-center py-5">Artiste introuvable.</div>;

    return (
        <div className="artist-detail-page">
            <div className="artist-hero" style={{ backgroundImage: `url(${artist.image_url})` }}>
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1>{artist.stage_name}</h1>
                    <p className="artist-location"><i className="fas fa-map-marker-alt"></i> {artist.city}, {artist.country}</p>
                </div>
            </div>

            <div className="container artist-content">
                <div className="row">
                    <div className="col-lg-4 mb-5">
                        <div className="artist-info-card">
                            <h4>À propos</h4>
                            <p>{artist.bio}</p>
                            <div className="artist-contact">
                                <h6>Contact & Web</h6>
                                {artist.website && (
                                    <a href={artist.website.startsWith('http') ? artist.website : `https://${artist.website}`} target="_blank" rel="noreferrer">
                                        <i className="fas fa-globe"></i> {artist.website}
                                    </a>
                                )}
                                <div className="social-icons">
                                    <i className="fab fa-instagram"></i>
                                    <i className="fab fa-facebook"></i>
                                    <i className="fab fa-pinterest"></i>
                                </div>
                            </div>
                            <hr />
                            <Timeline events={artist.events} />
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="gallery-header">
                            <h3>Galerie de l'artiste</h3>
                            <span>{artist.artworks.length} Œuvres</span>
                        </div>
                        <div className="artworks-grid">
                            {artist.artworks.map((art) => (
                                <div key={art.id} className="artwork-card">
                                    <div className="artwork-image">
                                        <img src={art.image_url} alt={art.title} />
                                        <div className="artwork-overlay"><button>Agrandir</button></div>
                                    </div>
                                    <div className="artwork-info">
                                        <h6>{art.title}</h6>
                                        <p>{art.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}