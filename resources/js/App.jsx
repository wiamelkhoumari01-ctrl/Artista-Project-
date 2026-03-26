import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RouterConfig from './router/config';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/feature/Navbar';
import Footer from './components/feature/Footer';
import LoadingScreen from './components/LoadingScreen';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

// Ce composant gère l'affichage switch entre Loading et Site
const AppContent = () => {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="app-wrapper">
            <Navbar />
            <RouterConfig />
            <Footer />
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