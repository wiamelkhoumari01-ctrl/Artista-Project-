import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RouterConfig from './router/config';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/feature/Navbar';
import Footer from './components/feature/Footer';

// Petit composant interne pour gérer le scroll auto
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

export default function App() {
    return (
        <LanguageProvider>
        <AuthProvider>
            <BrowserRouter>
                <ScrollToTop />
                <div className="app-wrapper">
                    <Navbar />
                    <RouterConfig />
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
        </LanguageProvider>
    );
}