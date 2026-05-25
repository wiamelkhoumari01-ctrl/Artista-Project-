import React, { useEffect, useState } from "react";
import api from "../../api";
import { useLanguage } from "../../context/LanguageContext";
import SearchBar from "../../components/ui/SearchBar";
import FiltrerBar from "../../components/ui/FiltrerBar";
import ArtistCard from "../../components/ui/ArtistCard";
import "../../../css/artists.css";

export default function PageArtistes() {
  const { locale, t } = useLanguage();
  const [searchQuery,     setSearchQuery]     = useState("");
  const [activeCatId,     setActiveCatId]     = useState(null); // null = Tous
  const [dbArtistes,      setDbArtistes]      = useState([]);
  const [allCategories,   setAllCategories]   = useState([]);
  const [filteredArtistes,setFilteredArtistes] = useState([]);
  const [loading,         setLoading]         = useState(true);

  // Résout le nom d'une catégorie selon la locale
  const getCatName = (nameField) => {
    if (!nameField) return '';
    if (typeof nameField === 'string') {
      try { const p = JSON.parse(nameField); return p[locale] || p.fr || p.en || nameField; }
      catch { return nameField; }
    }
    if (typeof nameField === 'object') return nameField[locale] || nameField.fr || nameField.en || '';
    return '';
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [artistRes, catRes] = await Promise.all([
          api.get(`/api/artists?lang=${locale}`),
          api.get('/api/categories'),
        ]);

        // Stocke les catégories avec leur id + nom résolu
        const cats = Array.isArray(catRes.data) ? catRes.data : [];
        setAllCategories(cats);

        const formatted = (Array.isArray(artistRes.data) ? artistRes.data : []).map(a => ({
          id:         a.id,
          category_id: a.category?.id || null,     // ← ID numérique pour le filtre
          nom_scene:  a.artist_translations?.[0]?.stage_name || 'Artiste',
          specialite: getCatName(a.category?.category_translations?.[0]?.name || a.category?.name)
                      || 'Membre Artista',
          photo_url:  a.image_url || '/images/default-avatar.png',
          slug:       a.artist_translations?.[0]?.slug || a.slug,
          description:a.artist_translations?.[0]?.bio,
        }));

        setDbArtistes(formatted);
      } catch (error) {
        console.error('Erreur API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [locale]);

  // Filtre artistes — par ID catégorie + recherche texte
  useEffect(() => {
    let result = [...dbArtistes];

    if (searchQuery) {
      result = result.filter(a =>
        a.nom_scene.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par ID — indépendant de la langue
    if (activeCatId !== null) {
      result = result.filter(a => a.category_id === activeCatId);
    }

    setFilteredArtistes(result);
  }, [searchQuery, activeCatId, dbArtistes]);

  // Construit la liste des catégories pour FiltrerBar
  // avec "Tous" en premier + catégories de la BDD
  const categoriesForBar = [
    { id: null, label: locale === 'ar' ? 'الكل' : locale === 'en' ? 'All' : 'Tous' },
    ...allCategories.map(cat => ({
      id:    cat.id,
      label: getCatName(cat.name),
    })),
  ];

  return (
    <div className="artistes-template-page">
      <div className="container">
        <div className="header-text">
          <h1 className="main-title">{t('artists.page_title')}</h1>
          <p className="main-subtitle">{t('artists.page_subtitle')}</p>
        </div>

        <SearchBar onSearch={setSearchQuery} />

        {/* FiltrerBar reçoit les catégories avec id+label */}
        <FiltrerBar
          categories={categoriesForBar}
          activeCategory={activeCatId}
          onFilterChange={setActiveCatId}
        />

        <div className="artists-grid">
          {loading ? (
            [1, 2, 3, 4].map(n => (
              <div key={n} className="skeleton skeleton-card" />
            ))
          ) : filteredArtistes.length > 0 ? (
            filteredArtistes.map(artiste => (
              <ArtistCard key={artiste.id} artiste={artiste} />
            ))
          ) : (
            <p className="text-center w-100">{t('common.no_results')}</p>
          )}
        </div>
      </div>
    </div>
  );
}