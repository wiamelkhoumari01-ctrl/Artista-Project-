import React, { useEffect, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RouterConfig from './router/config';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/feature/Navbar';
import Footer from './components/feature/Footer';
import LoadingScreen from './components/LoadingScreen';
import ChatBot from './components/ChatBot';


const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // ── Cas 1 : Navigation simple sans hash → remonte en haut ────────
        if (!hash) {
            window.scrollTo(0, 0);
            return;
        }

        const scrollToHash = () => {
            const id = hash.replace('#', '');
            const el = document.getElementById(id);

            if (el) {
                // getBoundingClientRect donne la position après layout complet
                const navbarHeight = 80; // hauteur fixe de la navbar
                const top =
                    el.getBoundingClientRect().top +
                    window.pageYOffset -
                    navbarHeight;

                window.scrollTo({ top, behavior: 'smooth' });
            }
        };

        // Double RAF (requestAnimationFrame) + délai pour garantir
        // que les sections à hauteur variable sont toutes peintes.
        const t1 = setTimeout(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    scrollToHash();
                });
            });
        }, 350);

        return () => clearTimeout(t1);

    }, [pathname, hash]);

    return null;
};

const AppContent = () => {
    const { loading }       = useAuth();
    const location          = useLocation();
    const isHome            = location.pathname === '/';
    const [navOpen, setNavOpen] = useState(false);

    if (loading) return <LoadingScreen />;
    return (
        <div className="app-wrapper">
            <Navbar onMenuToggle={setNavOpen} />
            <RouterConfig />
            <Footer />
            {isHome && <ChatBot navOpen={navOpen} />}
        </div>
    );
};

export default function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <BrowserRouter>
                    <ScrollToTop />
                    <AppContent />
                </BrowserRouter>
            </AuthProvider>
        </LanguageProvider>
    );
}
