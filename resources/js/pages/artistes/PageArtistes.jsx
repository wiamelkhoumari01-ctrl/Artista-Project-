import React, { useState, useEffect } from "react";
import api from "../../api"; 
import { useLanguage } from "../../context/LanguageContext";
import SearchBar from "../../components/ui/SearchBar";
import FiltrerBar from "../../components/ui/FiltrerBar";
import ArtistCard from "../../components/ui/ArtistCard";
import "../../../css/artists.css";

const categories = ["Tous", "Peinture Abstraite", "Sculpture Moderne", "Photographie Artistique", "Art Numérique", "Illustration", "Art Contemporain"];

export default function PageArtistes() {
  const { locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [dbArtistes, setDbArtistes] = useState([]);
  const [filteredArtistes, setFilteredArtistes] = useState([]);
  const [loading, setLoading] = useState(true); // Ajout de l'état loading

  useEffect(() => {
    const fetchArtistes = async () => {
      setLoading(true); // On commence le chargement
      try {
        const response = await api.get(`/api/artists?lang=${locale}`);
        const formatted = response.data.map(a => ({
          id: a.id,
          nom_scene: a.artist_translations?.[0]?.stage_name || "Artiste",
          specialite: a.category?.category_translations?.[0]?.name || "Membre Artista",
          photo_url: a.image_url || "/images/default-avatar.png",
          slug: a.artist_translations?.[0]?.slug,
          description: a.artist_translations?.[0]?.bio
        }));
        setDbArtistes(formatted);
      } catch (error) {
        console.error("Erreur API:", error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };
    fetchArtistes();
  }, [locale]);

  useEffect(() => {
    let result = [...dbArtistes];
    if (searchQuery) {
      result = result.filter(a => a.nom_scene.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (activeCategory !== "Tous") {
      result = result.filter(a => a.specialite === activeCategory);
    }
    setFilteredArtistes(result);
  }, [searchQuery, activeCategory, dbArtistes]);

  return (
    <div className="artistes-template-page">
      <div className="container">
        <div className="header-text">
          <h1 className="main-title">Nos Artistes</h1>
          <p className="main-subtitle">Découvrez les talents qui composent notre communauté artistique</p>
        </div>
        <SearchBar onSearch={setSearchQuery} />
        <FiltrerBar categories={categories} activeCategory={activeCategory} onFilterChange={setActiveCategory} />
        
        <div className="artists-grid">
          {loading ? (
            // Affiche 4 Skeletons pendant le chargement
            [1, 2, 3, 4].map((n) => <div key={n} className="skeleton skeleton-card"></div>)
          ) : filteredArtistes.length > 0 ? (
            filteredArtistes.map((artiste) => (
              <ArtistCard key={artiste.id} artiste={artiste}  />
            ))
          ) : (
            <p className="text-center w-100">Aucun artiste trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}