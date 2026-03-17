// import { createContext, useState, useContext, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//     // On initialise l'utilisateur à null
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Au chargement, on vérifie si l'utilisateur est déjà connecté via Laravel
//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const response = await axios.get('/api/user'); // Route de base de Laravel Sanctum
//                 setUser(response.data);
//             } catch (error) {
//                 setUser(null);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         checkAuth();
//     }, []);

//     const login = async (email, password) => {
//         try {
//             // 1. On appelle la route de login Laravel
//             const response = await axios.post('/api/login', { email, password });
            
//             // 2. On stocke l'utilisateur avec son ROLE (admin, artiste ou utilisateur)
//             setUser(response.data.user);
//             return { success: true };
//         } catch (error) {
//             return { success: false, message: error.response?.data?.message || "Erreur de connexion" };
//         }
//     };

//     const logout = async () => {
//         try {
//             await axios.post('/api/logout');
//             setUser(null);
//         } catch (error) {
//             console.error("Erreur lors de la déconnexion", error);
//         }
//     };

//     // Fonctions utilitaires très utiles pour tes pages
//     const isArtiste = () => user?.role === 'artiste';
//     const isAdmin = () => user?.role === 'admin';

//     return (
//         <AuthContext.Provider value={{ user, login, logout, loading, isArtiste, isAdmin }}>
//             {/* On ne rend les enfants que quand la vérification d'auth est finie */}
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     return useContext(AuthContext);
// }

// resources/js/context/AuthContext.jsx
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    // On force loading à false pour que le site s'affiche immédiatement
    const [loading, setLoading] = useState(false);

    const login = (email, password) => {
        // Simulation pour tester tes interfaces
        if (email === "artiste@test.fr") {
            setUser({ name: "Artiste Test", role: 'artiste', email });
            return { success: true };
        }
        setUser({ name: "Utilisateur Test", role: 'utilisateur', email });
        return { success: true };
    };

    const logout = () => {
        setUser(null);
    };

    // On ajoute ces fonctions pour éviter que tes composants ne plantent
    const isArtiste = () => user?.role === 'artiste';
    const isAdmin = () => user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isArtiste, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}