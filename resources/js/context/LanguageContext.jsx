import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // 1. On initialise avec la langue stockée ou 'fr' par défaut
    const [locale, setLocale] = useState(localStorage.getItem('lang') || 'fr');
    const [availableLanguages, setAvailableLanguages] = useState([]);

    useEffect(() => {
        // 2. On tente de récupérer les vraies langues de ta base de données
        axios.get('/api/languages')
            .then(res => {
                setAvailableLanguages(res.data);
                
                // Si l'utilisateur n'a jamais choisi de langue, 
                // on regarde s'il y a une langue par défaut dans ta DB
                const defaultLang = res.data.find(l => l.is_default);
                if (!localStorage.getItem('lang') && defaultLang) {
                    setLocale(defaultLang.code);
                }
            })
            .catch(() => {
                // 3. SECOURS : Si l'API Laravel ne répond pas, on met ces langues par défaut
                // Comme ça, ton select dans la nav n'est jamais vide.
                setAvailableLanguages([
                    { id: 1, code: 'fr', name: 'Français' },
                    { id: 2, code: 'en', name: 'English' },
                    { id: 3, code: 'ar', name: 'العربية' }
                ]);
            });
    }, []);

    // 4. Fonction pour changer la langue partout sur le site
    const changeLanguage = (code) => {
        setLocale(code);
        localStorage.setItem('lang', code);
    };

    return (
        <LanguageContext.Provider value={{ locale, changeLanguage, availableLanguages }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);