import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen,   setIsOpen]   = useState(false);
  const navRef = useRef(null);

  const { user, logout }                                    = useAuth();
  const location                                            = useLocation();
  const { locale, changeLanguage, availableLanguages, t }  = useLanguage();

  const isAr   = locale === 'ar';
  const isDark = location.pathname !== "/" && location.pathname !== "/event";

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme le menu au changement de route
  useEffect(() => { setIsOpen(false); }, [location]);

  // Ferme le menu au clic extérieur (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Bloque le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const displayEmail   = typeof user?.email === 'string' ? user.email : (user?.email?.email || '');
  const displayName    = user?.username || user?.first_name || displayEmail.split('@')[0] || t('nav.profile');
  const displayInitial = displayName.charAt(0).toUpperCase();

  const navBtnClass = (isDark || scrolled) ? "btn-outline-dark" : "btn-outline-light";
  const navBtnStyle = (isDark || scrolled)
    ? { color: '#000', borderColor: '#c5a059' }
    : { color: '#fff', borderColor: '#fff' };

  return (
    <>
      {/* Overlay sombre derrière le menu mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1040,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <nav
        ref={navRef}
        className={`navbar hero-nav fixed-top navbar-expand-lg py-3 ${isDark ? "navbar-dark-mode" : "navbar-light-mode"} ${scrolled ? "scrolled" : ""}`}
        dir={isAr ? 'rtl' : 'ltr'}
        style={{ zIndex: 1050 }}
      >
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/images/logo_art.png"
              style={{ width: 50, height: 50, marginLeft: isAr ? 5 : 0, marginRight: isAr ? 0 : 5 }}
              alt="Logo"
            />
            <span className="nomlogo">ARTISTA.</span>
          </Link>

          {/* Bouton hamburger */}
          <button
            className={`navbar-toggler ${isOpen ? 'active' : ''}`}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
          >
            {/* Icône hamburger animée */}
            <div style={{
              width: 24, height: 18,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block',
                  height: 2,
                  background: (isDark || scrolled) ? '#000' : '#fff',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  transformOrigin: 'center',
                  transform: isOpen
                    ? i === 0 ? 'translateY(8px) rotate(45deg)'
                    : i === 1 ? 'opacity: 0; scaleX(0)'
                    : 'translateY(-8px) rotate(-45deg)'
                    : 'none',
                  opacity: isOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </div>
          </button>

          {/* Menu — drawer sur mobile, inline sur desktop */}
          <div
            style={{
              // Mobile : drawer latéral depuis le haut
              position: window.innerWidth < 992 ? 'fixed' : 'static',
              top:      window.innerWidth < 992 ? 0 : 'auto',
              right:    window.innerWidth < 992 ? (isAr ? 'auto' : 0) : 'auto',
              left:     window.innerWidth < 992 ? (isAr ? 0 : 'auto') : 'auto',
              height:   window.innerWidth < 992 ? '100vh' : 'auto',
              width:    window.innerWidth < 992 ? '280px' : 'auto',
              background: window.innerWidth < 992 ? '#f6efe6' : 'transparent',
              transform: window.innerWidth < 992
                ? (isOpen ? 'translateX(0)' : (isAr ? 'translateX(-100%)' : 'translateX(100%)'))
                : 'none',
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 1060,
              overflowY: window.innerWidth < 992 ? 'auto' : 'visible',
              paddingTop: window.innerWidth < 992 ? '80px' : 0,
              boxShadow: window.innerWidth < 992 && isOpen
                ? (isAr ? '-8px 0 30px rgba(0,0,0,0.15)' : '8px 0 30px rgba(0,0,0,0.15)')
                : 'none',
            }}
            id="navMain"
          >
            <ul className="navbar-nav ms-auto align-items-lg-center"
                style={{ padding: window.innerWidth < 992 ? '0 24px' : 0 }}>

              {[
                { to: '/', label: t('nav.home') },
                { to: '/artistes', label: t('nav.artists') },
                { to: '/event', label: t('nav.events') },
              ].map(({ to, label }) => (
                <li key={to} className="nav-item" style={{ marginBottom: window.innerWidth < 992 ? 4 : 0 }}>
                  <NavLink
                    className="nav-link"
                    to={to}
                    onClick={() => setIsOpen(false)}
                    style={({ isActive }) => ({
                      color: window.innerWidth < 992
                        ? (isActive ? '#c5a059' : '#333')
                        : undefined,
                      fontWeight: window.innerWidth < 992 ? 600 : undefined,
                      fontSize: window.innerWidth < 992 ? 16 : undefined,
                      padding: window.innerWidth < 992 ? '12px 0' : undefined,
                      borderBottom: window.innerWidth < 992 ? '1px solid rgba(0,0,0,0.06)' : undefined,
                      display: 'block',
                    })}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}

              <li className="nav-item" style={{ marginBottom: window.innerWidth < 992 ? 4 : 0 }}>
                <HashLink
                  smooth
                  className="nav-link"
                  to="/#contact"
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: window.innerWidth < 992 ? '#333' : undefined,
                    fontWeight: window.innerWidth < 992 ? 600 : undefined,
                    fontSize: window.innerWidth < 992 ? 16 : undefined,
                    padding: window.innerWidth < 992 ? '12px 0' : undefined,
                    borderBottom: window.innerWidth < 992 ? '1px solid rgba(0,0,0,0.06)' : undefined,
                    display: 'block',
                  }}
                >
                  {t('nav.contact')}
                </HashLink>
              </li>

              {/* Sélecteur langue */}
              <li className="nav-item mx-lg-3" style={{ marginTop: window.innerWidth < 992 ? 16 : 0 }}>
                <select
                  className="lang-select-nav"
                  value={locale}
                  onChange={e => changeLanguage(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #c5a059',
                    borderRadius: '5px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    color: (isDark || scrolled || window.innerWidth < 992) ? '#000' : '#fff',
                    width: window.innerWidth < 992 ? '100%' : 'auto',
                  }}
                >
                  {availableLanguages.map(lang => (
                    <option key={lang.id} value={lang.code} style={{ color: '#000' }}>
                      {lang.code.toUpperCase()}
                    </option>
                  ))}
                </select>
              </li>

              {/* User dropdown / connexion */}
              {user ? (
                <li className="nav-item dropdown ms-lg-2" style={{ marginTop: window.innerWidth < 992 ? 16 : 0 }}>
                  {window.innerWidth < 992 ? (
                    // Mobile : affiche directement les liens sans dropdown
                    <div style={{ background: '#fff', borderRadius: 14, padding: '16px', marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: '#c5a059', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 16,
                        }}>
                          {displayInitial}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{displayName}</div>
                          <div style={{ fontSize: 11, color: '#999' }}>{displayEmail}</div>
                        </div>
                      </div>

                      {user.role === 'artiste' && (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            style={{ display: 'block', padding: '10px 0', color: '#333', fontSize: 15, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                          >
                            👤 {t('nav.profile')}
                          </Link>
                          <Link
                            to="/artist/dashboard"
                            onClick={() => setIsOpen(false)}
                            style={{ display: 'block', padding: '10px 0', color: '#333', fontSize: 15, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                          >
                            📊 {t('nav.dashboard')}
                          </Link>
                        </>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsOpen(false)}
                          style={{ display: 'block', padding: '10px 0', color: '#c5a059', fontWeight: 700, fontSize: 15, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                        >
                          ⚙️ {t('nav.dashboard')}
                        </Link>
                      )}

                      <button
                        onClick={() => { setIsOpen(false); logout(); }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '10px 0', color: '#e53935',
                          background: 'none', border: 'none', alignItems:"center",
                          fontWeight: 700, fontSize: 15, cursor: 'pointer',
                          marginTop: 4, 
                        }}
                      >
                       {t('nav.logout')}
                      </button>
                    </div>
                  ) : (
                    // Desktop : dropdown Bootstrap classique
                    <>
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

                      <ul
                        className={`dropdown-menu ${isAr ? 'dropdown-menu-start' : 'dropdown-menu-end'} shadow border-0 rounded-0 p-3`}
                        aria-labelledby="navbarDropdown"
                      >
                        <div className="d-flex align-items-center mb-2 p-2 bg-light">
                          <div
                            className="text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{ width: 40, height: 40, fontWeight: 'bold', backgroundColor: '#c5a059', fontSize: '1.1rem' }}
                          >
                            {displayInitial}
                          </div>
                          <div className={isAr ? "me-3 text-end" : "ms-3 text-start"}>
                            <div className="fw-bold small" style={{ fontFamily: 'Playfair Display, serif' }}>{displayName}</div>
                            <div className="text-muted" style={{ fontSize: '10px' }}>{displayEmail}</div>
                          </div>
                        </div>

                        {user.role === 'artiste' && (
                          <>
                            <li><Link className="dropdown-item" to="/profile">👤 {t('nav.profile')}</Link></li>
                            <li><Link className="dropdown-item" to="/artist/dashboard">📊 {t('nav.dashboard')}</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                          </>
                        )}

                        {user.role === 'admin' && (
                          <>
                            <li>
                              <Link className="dropdown-item admin-link" style={{ color: '#c5a059', fontWeight: 'bold' }} to="/admin/dashboard">
                                ⚙️ {t('nav.dashboard')}
                              </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                          </>
                        )}

                        <li>
                          <button className="dropdown-item text-danger fw-bold" onClick={logout}>
                            {t('nav.logout')}
                          </button>
                        </li>
                      </ul>
                    </>
                  )}
                </li>
              ) : (
                <li className="nav-item ms-lg-3" style={{ marginTop: window.innerWidth < 992 ? 16 : 0 }}>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <button
                      className={`btnconnexion rounded-pill p-2 px-4`}
                      style={{
                        width: window.innerWidth < 992 ? '100%' : 'auto',
                        background: (scrolled || window.innerWidth < 992) ? '#000' : '#fff',
                        color: (scrolled || window.innerWidth < 992) ? '#fff' : '#000',
                      }}
                    >
                      {t('nav.login')}
                    </button>
                  </Link>
                </li>
              )}

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}