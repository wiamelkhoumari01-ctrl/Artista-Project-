import React from "react";
import { Link } from "react-router-dom";

export default function ArtistCard({ artiste }) {

return (

<Link to={`/artistes/${artiste.slug}`} className="artist-card">

<img
src={artiste.photo_url}
alt={artiste.nom_scene}
/>

<div className="artist-card-body">

<h3 className="artist-name">
{artiste.nom_scene}
</h3>

<span className="artist-specialty">
{artiste.specialite}
</span>

<p className="artist-description">
{artiste.description}
</p>

</div>

</Link>

);
}