import React from 'react';

export default function Footer() {
  return (
    <footer className="custom-footer">
      <div className="container">
        <div className="row align-items-start">
          
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-brand mb-3">
  
              <img src="/images/logo_art.png" alt="Logo Artiste" className="footer-logo" />
              <span className="brand-name">ARTISTA.</span>
            </div>
            <p className="description">
              Plateforme dédiée aux artistes pour partager leurs oeuvres, biographies et tournées avec le monde entier.
            </p>
            <div className="social-icons">
              <a 
                href="https://www.facebook.com/profile.php?id=61584894126989" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-x-twitter"></i>
              <a 
                href="https://www.linkedin.com/in/wiam-elkhoumari-b28343399/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
              <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 px-lg-5">
            <h6 className="footer-title">INFORMATIONS</h6>
            <div className="contact-info-container">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <p>123 Rue de l'Art, Casablanca, Maroc</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone-alt"></i>
                <p>+212 7 75 48 42 64</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <p>contact@artista.fr</p>
              </div>
            </div>
          </div>

          <div className="col-lg-5 col-md-12 mb-4 text-end">
            <img 
              src="/images/footerimg.png"
              className="footer-gallery-img"
              alt="Galerie Footer"
            />
          </div>
        </div>

        <div className="footer-bottom mt-4 pt-3">
          <div className="row">
            <div className="col-md-6">
              <small>&copy; {new Date().getFullYear()} ARTISTA. Tous droits réservés.</small>
            </div>
            <div className="col-md-6 text-md-end">
              <span className="footer-link">Mentions légales</span>
              <span className="footer-link">Confidentialité</span>
              <span className="footer-link">CGU</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}