import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const scrollToArtistes = () => {
    const section = document.getElementById("bas");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section position-relative d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <img 
        src="/images/pic.webp" 
        alt="Studio d'artiste" 
        className="hero-bg" 
        loading="eager" 
        fetchPriority="high"
      />
      <div className="hero-overlay"></div>

      <div className="container text-center text-white position-relative" style={{ zIndex: 2 }}>
        {/* Ton texte ART géant */}
        <h1 className="Art display-1 fw-light fst-italic mb-0">Art</h1>
        <h2 className="display-2 fw-bold mb-4">Portfolio d'Artistes</h2>
        
        <p className="lead mb-5 mx-auto" style={{ maxWidth: '700px' }}>
          Découvrez des talents exceptionnels, explorez leurs œuvres uniques et suivez leurs tournées artistiques.
        </p>
        
        <Link to="/artistes" className="btn btn-artiste">
          Découvrir les Artistes 
          <span className="fleche">→</span>
        </Link>
      </div>

      <button
        className="hero-scroll-btn"
        onClick={scrollToArtistes}
        aria-label="Scroll vers artistes"
      >
        <i className="fas fa-chevron-down"></i>
      </button>
    </section>
  );
}