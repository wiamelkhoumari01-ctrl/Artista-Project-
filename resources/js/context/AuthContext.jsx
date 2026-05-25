

import { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const res = await api.get('/api/user');
                    // Met à jour le user avec les données fraîches du serveur
                    const freshUser = {
                        id:         res.data.id,
                        email:      res.data.email,
                        role:       res.data.role,
                        first_name: res.data.first_name,
                        last_name:  res.data.last_name,
                        username:   res.data.first_name
                            ? res.data.first_name + ' ' + res.data.last_name
                            : res.data.email?.split('@')[0],
                    };
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                } catch (e) {
                    cleanLocalAuth();
                }
            }
            setTimeout(() => setLoading(false), 800);
        };

        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    cleanLocalAuth();
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );

        checkAuth();
        return () => api.interceptors.response.eject(interceptor);
    }, []);

    const cleanLocalAuth = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const handleAuthSuccess = (token, userData) => {
    localStorage.setItem('access_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
};
    const login = async (email, password) => {
        try {
            await api.get('/sanctum/csrf-cookie');
            const res = await api.post('/api/login', { email, password });
            if (res.data.success) {
                handleAuthSuccess(res.data.access_token, res.data.user);
                return { success: true, user: res.data.user };
            }
            return { success: false, message: res.data.message };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Identifiants incorrects',
            };
        }
    };

    const logout = async () => {
        try { await api.post('/api/logout'); }
        catch (e) { console.error(e); }
        finally {
            cleanLocalAuth();
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading, handleAuthSuccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);