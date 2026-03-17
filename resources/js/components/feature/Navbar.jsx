import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const { locale, changeLanguage, availableLanguages } = useLanguage();

  const isDark = location.pathname !== "/" && location.pathname !== "/event";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  return (
    <nav className={`navbar hero-nav fixed-top navbar-expand-lg py-3 ${isDark ? "navbar-dark-mode" : "navbar-light-mode"} ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/images/logo_art.png" style={{ width: 50, height: 50, marginRight: 5 }} alt="Logo" />
          <span className='nomlogo'>ARTISTA.</span>
        </Link>

        <button className="navbar-toggler" type="button" onClick={() => setIsOpen(!isOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navMain">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Accueil</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/artistes">Artistes</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/event">Événements</NavLink>
            </li>
            <li className="nav-item">
              <HashLink smooth className="nav-link" to="/#contact">Contact</HashLink>
            </li>

            {/* --- SELECTEUR DE LANGUE --- */}
            <li className="nav-item ms-lg-3">
              <select 
                className="lang-select-nav" 
                value={locale} 
                onChange={(e) => changeLanguage(e.target.value)}
              >
                {availableLanguages.length > 0 ? (
                  availableLanguages.map(lang => (
                    <option key={lang.id} value={lang.code}>
                      {lang.code.toUpperCase()}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="fr">FR</option>
                    <option value="en">EN</option>
                    <option value="ar">AR</option>
                  </>
                )}
              </select>
            </li>

            {/* Authentification */}
            {user ? (
              <li className="nav-item dropdown ms-lg-3">
                <button className="btn btn-outline-dark rounded-pill dropdown-toggle" data-bs-toggle="dropdown">
                  {user.username || user.first_name || user.email}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 p-3">
                  <div className="d-flex align-items-center mb-3 p-2">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, fontWeight: 'bold' }}>
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="ms-3">
                      <div className="fw-bold small">{user.username || user.first_name || 'Utilisateur'}</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>{user.email}</div>
                    </div>
                  </div>

                  {/* SI C'EST UN ARTISTE : On affiche les accès de gestion */}
                  {user.role === 'artiste' && (
                    <>
                      <li><Link className="dropdown-item rounded-3" to="/profile">👤 Mon Profil Artiste</Link></li>
                      <li><Link className="dropdown-item rounded-3" to="/dashboard">📊 Tableau de bord</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}

                  {/* POUR TOUT LE MONDE : Bouton déconnexion */}
                  <li>
                    <button className="dropdown-item text-danger rounded-3" onClick={logout}>
                      Se déconnecter
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item ms-lg-3">
                <Link to="/login">
                  <button className={`btnconnexion rounded-pill p-2 px-4 ${(isDark || scrolled) ? "btn-dark" : "btn-light"}`}>
                    Connexion
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}