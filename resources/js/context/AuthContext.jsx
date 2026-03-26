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
                try {
                    const res = await api.get('/api/user');
                    setUser(res.data);
                } catch (e) {
                    cleanLocalAuth();
                }
            }
            // On laisse respirer le logo 800ms pour un effet plus fluide
            setTimeout(() => setLoading(false), 800);
        };

        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    cleanLocalAuth();
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = "/login";
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
        localStorage.setItem('user', JSON.stringify(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const login = async (email, password) => {
        try {
            await api.get('/sanctum/csrf-cookie');
            const res = await api.post('/api/login', { email, password });
            if (res.data.success) {
                handleAuthSuccess(res.data.access_token, res.data.user);
                return { success: true };
            }
        } catch (e) {
            return { success: false, message: e.response?.data?.message || "Identifiants incorrects" };
        }
    };

    const logout = async () => {
        try { await api.post('/api/logout'); }
        catch (e) { console.error(e); }
        finally {
            cleanLocalAuth();
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading, handleAuthSuccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);