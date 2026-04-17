import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [isOpen,    setIsOpen]    = useState(false);
  const [isMobile,  setIsMobile]  = useState(window.innerWidth < 992);
  const navRef = useRef(null);

  const { user, logout }                                   = useAuth();
  const location                                           = useLocation();
  const { locale, changeLanguage, availableLanguages, t } = useLanguage();

  const isAr   = locale === 'ar';
  const isDark = location.pathname !== '/' && location.pathname !== '/event';

  // ── Scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Resize — isMobile réactif ────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Ferme au changement de route ─────────────────────────────────────
  useEffect(() => { setIsOpen(false); }, [location]);

  // ── Ferme au clic extérieur ──────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [isOpen]);

  // ── Bloque le scroll body sur mobile quand menu ouvert ───────────────
  useEffect(() => {
    document.body.style.overflow = (isOpen && isMobile) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isMobile]);

  // ── Données utilisateur ──────────────────────────────────────────────
  const displayEmail   = typeof user?.email === 'string' ? user.email : (user?.email?.email || '');
  const displayName    = user?.username || user?.first_name || displayEmail.split('@')[0] || t('nav.profile');
  const displayInitial = displayName.charAt(0).toUpperCase();

  const navBtnClass = (isDark || scrolled) ? 'btn-outline-dark' : 'btn-outline-light';
  const navBtnStyle = (isDark || scrolled)
    ? { color: '#000', borderColor: '#c5a059' }
    : { color: '#fff', borderColor: '#fff' };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && isMobile && (
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
        className={`navbar hero-nav fixed-top navbar-expand-lg py-3
          ${isDark ? 'navbar-dark-mode' : 'navbar-light-mode'}
          ${scrolled ? 'scrolled' : ''}`}
        dir={isAr ? 'rtl' : 'ltr'}
        style={{ zIndex: 1050 }}
      >
        <div className="container">

          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/images/logo_art.png"
              style={{ width: 50, height: 50, marginRight: isAr ? 0 : 5, marginLeft: isAr ? 5 : 0 }}
              alt="Logo Artista"
            />
            <span className="nomlogo">ARTISTA.</span>
          </Link>

          {/* Hamburger */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(v => !v)}
            aria-label="Toggle navigation"
            style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent' }}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Drawer mobile / inline desktop */}
          <div
            style={isMobile ? {
              position: 'fixed',
              top: 0,
              [isAr ? 'left' : 'right']: 0,
              height: '100vh',
              width: 280,
              background: '#f6efe6',
              transform: isOpen ? 'translateX(0)' : (isAr ? 'translateX(-100%)' : 'translateX(100%)'),
              transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
              zIndex: 1060,
              overflowY: 'auto',
              paddingTop: 80,
              boxShadow: isOpen ? '8px 0 30px rgba(0,0,0,0.15)' : 'none',
            } : {}}
          >
            <ul
              className="navbar-nav ms-auto align-items-lg-center"
              style={{ padding: isMobile ? '0 24px' : 0 }}
            >
              {/* Liens principaux */}
              {[
                { to: '/',        label: t('nav.home') },
                { to: '/artistes', label: t('nav.artists') },
                { to: '/event',   label: t('nav.events') },
              ].map(({ to, label }) => (
                <li key={to} className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={to}
                    onClick={() => setIsOpen(false)}
                    style={({ isActive }) => isMobile ? {
                      color: isActive ? '#c5a059' : '#333',
                      fontWeight: 600,
                      fontSize: 16,
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      display: 'block',
                    } : {}}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}

              <li className="nav-item">
                <HashLink
                  smooth
                  className="nav-link"
                  to="/#contact"
                  onClick={() => setIsOpen(false)}
                  style={isMobile ? {
                    color: '#333', fontWeight: 600, fontSize: 16,
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    display: 'block',
                  } : {}}
                >
                  {t('nav.contact')}
                </HashLink>
              </li>

              {/* Langue */}
              <li className="nav-item mx-lg-3" style={isMobile ? { marginTop: 16 } : {}}>
                <select
                  className="lang-select-nav"
                  value={locale}
                  onChange={e => changeLanguage(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #c5a059',
                    borderRadius: 5,
                    padding: '4px 8px',
                    cursor: 'pointer',
                    color: (isDark || scrolled || isMobile) ? '#000' : '#fff',
                    width: isMobile ? '100%' : 'auto',
                  }}
                >
                  {availableLanguages.map(lang => (
                    <option key={lang.id} value={lang.code} style={{ color: '#000' }}>
                      {lang.code.toUpperCase()}
                    </option>
                  ))}
                </select>
              </li>

              {/* User */}
              {user ? (
                <li className="nav-item dropdown ms-lg-2" style={isMobile ? { marginTop: 16 } : {}}>
                  {isMobile ? (
                    // ── Mobile : liens directs ──────────────────────────
                    <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
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
                          <Link to="/profile" onClick={() => setIsOpen(false)}
                            style={{ display: 'block', padding: '10px 0', color: '#333', fontSize: 15, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            👤 {t('nav.profile')}
                          </Link>
                          <Link to="/artist/dashboard" onClick={() => setIsOpen(false)}
                            style={{ display: 'block', padding: '10px 0', color: '#333', fontSize: 15, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            📊 {t('nav.dashboard')}
                          </Link>
                        </>
                      )}

                      {user.role === 'admin' && (
                        <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}
                          style={{ display: 'block', padding: '10px 0', color: '#c5a059', fontWeight: 700, fontSize: 15, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                          ⚙️ {t('nav.dashboard')}
                        </Link>
                      )}

                      <button
                        onClick={() => { setIsOpen(false); logout(); }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '10px 0', color: '#e53935',
                          background: 'none', border: 'none',
                          fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 4,
                        }}
                      >
                        🚪 {t('nav.logout')}
                      </button>
                    </div>
                  ) : (
                    // ── Desktop : dropdown Bootstrap ─────────────────────
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
                        className={`dropdown-menu ${isAr ? 'dropdown-menu-start' : 'dropdown-menu-end'} shadow border-0 p-3`}
                        aria-labelledby="navbarDropdown"
                      >
                        <div className="d-flex align-items-center mb-2 p-2 bg-light" style={{ borderRadius: 12 }}>
                          <div style={{
                            width: 40, height: 40, fontWeight: 'bold',
                            backgroundColor: '#c5a059', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: '1.1rem',
                          }}>
                            {displayInitial}
                          </div>
                          <div className={isAr ? 'me-3 text-end' : 'ms-3 text-start'}>
                            <div className="fw-bold small" style={{ fontFamily: 'Playfair Display, serif' }}>{displayName}</div>
                            <div className="text-muted" style={{ fontSize: 10 }}>{displayEmail}</div>
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
                              <Link className="dropdown-item admin-link"
                                style={{ color: '#c5a059', fontWeight: 'bold' }}
                                to="/admin/dashboard">
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
                <li className="nav-item ms-lg-3" style={isMobile ? { marginTop: 16 } : {}}>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <button
                      className="btnconnexion rounded-pill p-2 px-4"
                      style={{
                        width: isMobile ? '100%' : 'auto',
                        background: (scrolled || isMobile) ? '#000' : '#fff',
                        color: (scrolled || isMobile) ? '#fff' : '#000',
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
