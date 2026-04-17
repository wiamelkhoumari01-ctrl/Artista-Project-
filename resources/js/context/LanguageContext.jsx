import React, { createContext, useState, useContext, useEffect } from 'react';

// Importation des fichiers JSON (Statique)
import fr from '../langues/fr.json';
import en from '../langues/en.json';
import ar from '../langues/ar.json';

const LanguageContext = createContext();

const translations = { fr, en, ar };

export const LanguageProvider = ({ children }) => {
    // 1. Initialisation : On utilise 'app_locale' pour matcher avec api.js
    const [locale, setLocale] = useState(localStorage.getItem('app_locale') || 'fr');

    const availableLanguages = [
        { id: 1, code: 'fr', name: 'Français' },
        { id: 2, code: 'en', name: 'English' },
        { id: 3, code: 'ar', name: 'العربية' }
    ];

    // 2. Gestion de la direction (RTL/LTR) et de l'attribut lang
    useEffect(() => {
        const direction = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = direction;
        document.documentElement.lang = locale;
        // On sauvegarde systématiquement dans le localStorage
        localStorage.setItem('app_locale', locale);
    }, [locale]);

    // 3. Fonction pour changer la langue
    const changeLanguage = (code) => {
        if (translations[code]) {
            setLocale(code);
        }
    };

    /**
     * 4. Fonction de traduction statique t()
     * Gère les chemins imbriqués type 'nav.home'
     */
    const t = (path) => {
        const keys = path.split('.');
        let result = translations[locale] || translations['fr'];
        
        keys.forEach(key => {
            result = result ? result[key] : null;
        });
        
        return result || path; 
    };

    /**
     * 5. Fonction pour les données dynamiques du Backend
     * Utile si le backend renvoie { fr: "...", ar: "..." }
     */
    const d = (field) => {
        if (!field) return "";
        if (typeof field === 'string') return field;
        return field[locale] || field['fr'] || Object.values(field)[0] || "";
    };

    return (
        <LanguageContext.Provider value={{ 
            locale, 
            changeLanguage, 
            availableLanguages, 
            t, 
            d 
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);