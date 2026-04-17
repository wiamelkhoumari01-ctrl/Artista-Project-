import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

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
        alt={t('hero.bg_alt')} 
        className="hero-bg" 
        loading="eager" 
        fetchPriority="high"
      />
      <div className="hero-overlay"></div>

      <div className="container text-center text-white position-relative" style={{ zIndex: 2 }}>
        <h1 className="Art display-2 fw-light fst-italic mb-0">{t('hero.giant_text')}</h1>
        <h2 className="display-2 fw-bold mb-4">{t('hero.main_title')}</h2>
        
        <p className="lead mb-5 mx-auto" style={{ maxWidth: '700px' }}>
          {t('hero.description')}
        </p>
        
        <Link to="/artistes" className="btn btn-artiste">
          {t('hero.btn_text')}
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