import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Timeline from "../../components/ui/Timeline.jsx";
import "../../../css/artist-detail.css";

export default function ArtisteDetail() {

const { slug } = useParams();

const [artist] = useState({
stage_name: "Anthony Chambaud",
bio: "Artiste peintre passionné par l'exploration des couleurs et des textures. Mon travail se concentre sur l'émotion brute capturée à travers l'art abstrait.",
city: "Paris",
country: "France",
website: "www.chambaud-art.com",
image_url: "/images/Anthony_Chambaud_peinture_abstraite.jpg",

artworks:[
{ id:1,title:"Éclat d'Azur",image_url:"/images/art1.jpg",description:"Huile sur toile"},
{ id:2,title:"Ombres Portées",image_url:"/images/art2.jpg",description:"Acrylique"},
{ id:3,title:"Lueur Tardive",image_url:"/images/art3.jpg",description:"Technique mixte"},
{ id:4,title:"Fragments",image_url:"/images/art4.jpg",description:"Huile et pigments"}
],

events:[
{ id:1,title:"Exposition Solo",venue_name:"Galerie Moderne",start_date:"10 Mai 2026"},
{ id:2,title:"Atelier Ouvert",venue_name:"Atelier 42",start_date:"15 Juin 2026"}
]

});

return(

<div className="artist-detail-page">

{/* HERO */}
<div
className="artist-hero"
style={{backgroundImage:`url(${artist.image_url})`}}
>

<div className="hero-overlay"></div>

<div className="container hero-content">

<h1>{artist.stage_name}</h1>

<p className="artist-location">
<i className="fas fa-map-marker-alt"></i>
{artist.city}, {artist.country}
</p>

</div>

</div>


<div className="container artist-content">

<div className="row">

{/* LEFT SIDEBAR */}

<div className="col-lg-4 mb-5">

<div className="artist-info-card">

<h4>À propos</h4>

<p>{artist.bio}</p>

<div className="artist-contact">

<h6>Contact & Web</h6>

<a
href={`https://${artist.website}`}
target="_blank"
rel="noreferrer"
>

<i className="fas fa-globe"></i>
{artist.website}

</a>

<div className="social-icons">

<i className="fab fa-instagram"></i>
<i className="fab fa-facebook"></i>
<i className="fab fa-pinterest"></i>

</div>

</div>

<hr/>

<Timeline events={artist.events}/>


</div>

</div>


{/* RIGHT SIDE GALLERY */}

<div className="col-lg-8">

<div className="gallery-header">

<h3>Galerie de l'artiste</h3>

<span>{artist.artworks.length} Œuvres</span>

</div>

<div className="artworks-grid">

{artist.artworks.map((art)=>(
<div key={art.id} className="artwork-card">

<div className="artwork-image">

<img src={art.image_url} alt={art.title}/>

<div className="artwork-overlay">
<button>Agrandir</button>
</div>

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
