import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function ArtistCard({ artiste }) {
    const { locale } = useLanguage();

    if (!artiste) return null;

    // Support des deux formats : API backend (artist_translations) et mock front (nom_scene direct)
    const stageName = artiste.artist_translations?.[0]?.stage_name
        || artiste.nom_scene
        || "Artiste";

    const categoryName = artiste.category?.category_translations?.[0]?.name
        || artiste.specialite
        || "Artiste";

    // Support image_url (API) et photo_url (mock front)
    const imageUrl = artiste.image_url || artiste.photo_url || "/images/default-avatar.png";

    const slug = artiste.artist_translations?.[0]?.slug
        || artiste.slug
        || "#";

    return (
        <Link 
            to={`/artistes/${slug}`} 
            className="artist-card shadow-sm border-0 h-100 text-decoration-none"
            style={{ display: 'block', color: 'inherit' }}
        >
            <div className="artist-card-img-container" style={{ height: '300px', overflow: 'hidden' }}>
                <img
                    src={imageUrl}
                    alt={stageName}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => { e.target.src = "/images/default-artist.jpg"; }}
                />
            </div>
            
            <div className="artist-card-body p-3">
                <span className="badge mb-2" style={{ backgroundColor: '#c5a059', fontSize: '0.75rem' }}>
                    {categoryName}
                </span>
                <h3 className="artist-name h5 mb-2" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold' }}>
                    {stageName}
                </h3>
            </div>
        </Link>
    );
}