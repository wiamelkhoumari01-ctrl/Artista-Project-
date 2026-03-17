import React, { useState, useEffect } from "react";
import SearchBar from "../../components/ui/SearchBar";
import FiltrerBar from "../../components/ui/FiltrerBar";
import ArtistCard from "../../components/ui/ArtistCard";
import "../../../css/artists.css";

const mockArtistes = [
{
id: "1",
nom_scene: "Anthony Chambaud",
specialite: "Peinture Abstraite",
photo_url: "/images/Anthony_Chambaud_peinture_abstraite.jpg",
slug: "anthony-chambaud",
description: "Artiste explorant les émotions à travers les couleurs et les textures abstraites."
},
{
id: "2",
nom_scene: "Emmanuel Sellier",
specialite: "Sculpture Moderne",
photo_url: "/images/Emmanuel Sellier_sculpture_moderne.png",
slug: "emmanuel-sellier",
description: "Sculpteur contemporain transformant la matière en formes organiques."
},
{
id: "3",
nom_scene: "Hannah Reyes Morales",
specialite: "Photographie Artistique",
photo_url: "/images/Hannah-Reyes-Morales_photographe.jpg",
slug: "hannah-reyes-morales",
description: "Photographe documentaire capturant des histoires humaines fortes."
},
{
id: "4",
nom_scene: "Mad Dog Jones",
specialite: "Art Numérique",
photo_url: "/images/Mad dog jones_art numerique.webp",
slug: "mad-dog-jones",
description: "Artiste digital explorant le cyberpunk et les univers futuristes."
},
{
id: "5",
nom_scene: "Karla Ortiz",
specialite: "Illustration",
photo_url: "/images/Karla Ortiz_illustration.jpg",
slug: "karla-ortiz",
description: "Illustratrice reconnue pour ses univers fantastiques et cinématographiques."
},
{
id: "6",
nom_scene: "Cecily Brown",
specialite: "Art Contemporain",
photo_url: "/images/Cecily Brown_art_comtemporain.webp",
slug: "cecily-brown",
description: "Artiste contemporaine mêlant abstraction et narration picturale."
}
,
{
id: "7",
nom_scene: "Lois van Baarle",
specialite: "Illustration",
photo_url: "/images/lois-van-baarle-1023303.jpg",
slug: "Lois-van-Baarle",
description: "Spécialisée en illustration digitale et character design."
}
];

const categories = [
"Tous",
"Peinture Abstraite",
"Sculpture Moderne",
"Photographie Artistique",
"Art Numérique",
"Illustration",
"Art Contemporain"
];

export default function PageArtistes() {

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [filteredArtistes, setFilteredArtistes] = useState(mockArtistes);

  useEffect(() => {
    let result = mockArtistes;
    if (searchQuery) {
    result = result.filter(a =>
    a.nom_scene.toLowerCase().includes(searchQuery.toLowerCase())
    );
    }
    if (activeCategory !== "Tous") {
    result = result.filter(a => a.specialite === activeCategory);
    }
    setFilteredArtistes(result);
    }, [searchQuery, activeCategory]);

  return (

    <div className="artistes-template-page">

      <div className="container">

        <div className="header-text">
          <h1 className="main-title">Nos Artistes</h1>
          <p className="main-subtitle">
            Découvrez les talents qui composent notre communauté artistique
          </p>
        </div>

        <SearchBar onSearch={setSearchQuery} />

        <FiltrerBar
          categories={categories}
          activeCategory={activeCategory}
          onFilterChange={setActiveCategory}
        />

        <div className="artists-grid">

          {filteredArtistes.map((artiste) => (
            <ArtistCard key={artiste.id} artiste={artiste} />
          ))}

        </div>

      </div>

    </div>

  );
}