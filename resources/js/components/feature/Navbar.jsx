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

  const displayEmail = typeof user?.email === 'string' ? user.email : (user?.email?.email || '');
  const displayName = user?.username || user?.first_name || displayEmail.split('@')[0] || 'Utilisateur';
  const displayInitial = displayName.charAt(0).toUpperCase();

  const navBtnClass = (isDark || scrolled) ? "btn-outline-dark" : "btn-outline-light";
  const navBtnStyle = (isDark || scrolled)
    ? { color: '#000', borderColor: '#c5a059' }
    : { color: '#fff', borderColor: '#fff' };

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

            <li className="nav-item ms-lg-3">
              <select
                className="lang-select-nav"
                value={locale}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                {availableLanguages?.length > 0 ? (
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

            {user ? (
              <li className="nav-item dropdown ms-lg-3">
                <button
                  className={`btn rounded-pill dropdown-toggle ${navBtnClass}`}
                  type="button"
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={navBtnStyle}
                >
                  {displayName}
                </button>
                
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-0 p-3" aria-labelledby="navbarDropdown">
                  <div className="d-flex align-items-center mb-3 p-2 bg-light rounded-1">
                    <div className="text-white rounded-circle d-flex align-items-center justify-content-center"
                         style={{ width: 35, height: 35, fontWeight: 'bold', backgroundColor: '#c5a059' }}>
                      {displayInitial}
                    </div>
                    <div className="ms-3">
                      <div className="fw-bold small" style={{ fontFamily: 'Playfair Display, serif' }}>{displayName}</div>
                      <div className="text-muted" style={{ fontSize: '10px' }}>{displayEmail}</div>
                    </div>
                  </div>

                  {user.role === 'artiste' && (
                    <>
                      <li><Link className="dropdown-item" to="/profile">👤 Mon Profil Artiste</Link></li>
                      <li><Link className="dropdown-item" to="/artist/dashboard">📊 Tableau de bord</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}

                  {user.role === 'admin' && (
                    <>
                      <li><Link className="dropdown-item admin-link" style={{color: '#c5a059', fontWeight: 'bold'}} to="/admin/dashboard">⚙️ Admin Dashboard</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}

                  <li>
                    <button className="dropdown-item text-danger fw-bold" onClick={logout}>
                      Se déconnecter
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item ms-lg-3">
                <Link to="/login">
                  <button className={`btnconnexion rounded-pill p-2 px-4 ${scrolled ? "btn-dark" : "btn-light"}`}>
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