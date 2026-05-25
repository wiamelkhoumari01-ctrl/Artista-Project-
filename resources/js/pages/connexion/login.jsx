import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api';

const GOOGLE_CLIENT_ID = '832417069767-kfrrgdsmak62j88apqk6glrbsgison49.apps.googleusercontent.com';

export default function Login() {
    const { t } = useLanguage();
    const { login, handleAuthSuccess } = useAuth();
    const navigate = useNavigate();

    const [email,        setEmail]        = useState('');
    const [password,     setPassword]     = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error,        setError]        = useState('');
    const [loading,      setLoading]      = useState(false);

    // ── Connexion classique ──────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            redirectAfterLogin(result.user);
        } else {
            // Message adapté si le compte a été créé via Google
            setError(
                result.message?.includes('incorrect')
                    ? 'Email ou mot de passe incorrect. Si vous vous êtes inscrit avec Google, utilisez le bouton ci-dessous.'
                    : result.message
            );
        }
    };

    // ── Connexion Google ─────────────────────────────────────────────
    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setLoading(true);
        try {
            // On envoie le token Google — le backend détecte si l'email
            // existe déjà et connecte le compte, sinon redirige vers inscription
            const res = await api.post('/api/google-login', {
                token: credentialResponse.credential,
            });

            if (res.data.success) {
                handleAuthSuccess(res.data.access_token, res.data.user);
                redirectAfterLogin(res.data.user);
            }
        } catch (e) {
            if (e.response?.status === 404) {
                // Email Google inexistant en BDD → redirige vers inscription
                setError('Aucun compte trouvé avec ce Gmail. Veuillez vous inscrire.');
                setTimeout(() => navigate('/inscription'), 2000);
            } else {
                setError(e.response?.data?.message || 'Erreur de connexion Google.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('La connexion Google a échoué.');
    };

    const redirectAfterLogin = (user) => {
        if (user?.role === 'admin')   return navigate('/admin/dashboard');
        if (user?.role === 'artiste') return navigate('/artist/dashboard');
        navigate('/');
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="login-container">
                <header className="header">
                    <h1 className="title">{t('auth.login_title')}</h1>
                    <p className="subtitle">{t('auth.login_subtitle')}</p>
                </header>

                <main className="login-card">
                    {error && (
                        <div className="alert-danger" style={{ marginBottom: 16, borderRadius: 12, padding: '12px 16px', fontSize: 14 }}>
                            {error}
                        </div>
                    )}

                    {/* ── Formulaire classique ── */}
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group mb-3" style={{ width: '100%', display: 'block' }}>
                            <label className="form-label-custom">{t('auth.email')}</label>
                            <input
                                type="email"
                                className="form-control-pill"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group mb-3">
                            <label className="form-label-custom">{t('auth.password')}</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control-pill"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(v => !v)}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                            <Link
                                to="/forgot-password"
                                style={{ fontSize: 12, color: '#666', marginTop: 8, marginLeft: 15, display: 'inline-block', textDecoration: 'none' }}
                            >
                                {t('auth.forgot_password_link')}
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary-pill mt-2"
                            disabled={loading}
                        >
                            {loading ? '...' : t('auth.login_btn')}
                        </button>
                    </form>

                    {/* ── Séparateur ── */}
                    <div className="divider"><span>{t('auth.or')}</span></div>

                    {/* ── Bouton Google ── */}
                    <div className="d-flex justify-content-center mb-3">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            shape="pill"
                            theme="outline"
                            text="signin_with"
                        />
                    </div>

                    <Link to="/inscription" className="signup-link d-block text-center">
                        {t('auth.no_account')}
                    </Link>
                </main>
            </div>
        </GoogleOAuthProvider>
    );
}