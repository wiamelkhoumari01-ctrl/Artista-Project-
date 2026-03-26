import React from 'react';
import { Link } from "react-router-dom";

export default  function  ArtistBiosSection ()  {
  return (
    <section className="bios-section">
      <div className="container">
        
        {/* BLOC 1 : Lois van Baarle (Image à GAUCHE) */}
        <div className="bio-card">
          <div className="bio-image-side">
            <img 
              src="/images/lois-van-baarle-artiste-1.webp" 
              alt="Lois van Baarle" 
            />
          </div>
          <div className="bio-text-side">
            <span className="bio-subtitle">BIOGRAPHIE</span>
            <h2 className="bio-title">Lois van Baarle</h2>
            <p className="bio-description">
              Plus connue sous le pseudonyme "Loish", Lois van Baarle est une illustratrice et concept artist 
              néerlandaise de renommée mondiale. Son style unique, caractérisé par des lignes fluides et une 
              maîtrise exceptionnelle de la lumière, a influencé une génération d'artistes numériques. Elle a 
              collaboré avec des studios prestigieux comme Disney et Guerrilla Games tout en publiant plusieurs 
              ouvrages d'art à succès.
            </p>
            <button className="bio-btn"><Link
              to={`/artistes/lois-van-baarle`}
              >Lire Plus</Link></button>
           
          </div>
        </div>

        {/* BLOC 2 : Antony Chambaud (Image à DROITE grâce à la classe 'reversed') */}
        <div className="bio-card reversed">
          <div className="bio-image-side">
            <img 
              src="/images/Anthony Chambaud biographie.jpg" 
              alt="Antony Chambaud" 
            />
          </div>
          <div className="bio-text-side">
            <span className="bio-subtitle">BIOGRAPHIE</span>
            <h2 className="bio-title">Antony Chambaud</h2>
            <p className="bio-description">
              Artiste peintre français spécialisé dans l'art abstrait, Antony Chambaud se distingue par son 
              approche instinctive de la couleur et de la texture. À travers ses compositions vibrantes, il 
              explore le mouvement et l'émotion pure, utilisant principalement l'acrylique pour créer des 
              œuvres qui invitent à la contemplation. Il partage également sa passion à travers des cours 
              pour démocratiser la pratique de la peinture abstraite.
            </p>
               <button className="bio-btn"><Link
                to={`/artistes/anthony-chambaud`}
              >Lire Plus</Link></button>
          </div>
        </div>

      </div>
    </section>
  );
};

