import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="login-container">
            <header className="header">
                <h1 className="title">{t('auth.login_title')}</h1>
                <p className="subtitle">{t('auth.login_subtitle')}</p>
            </header>

            <main className="login-card">
                {error && <div className="alert-danger">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group mb-3" style={{ width: '100%', display: 'block' }}>
                        <label className="form-label-custom">{t('auth.email')}</label>
                        <input 
                            type="email" 
                            className="form-control-pill"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="input-group mb-3">
                        <label className="form-label-custom">{t('auth.password')}</label>
                        <div className="password-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="form-control-pill"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <button 
                                type="button" 
                                className="password-toggle-btn" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                        <Link to="/forgot-password" style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginLeft: '15px', display: 'inline-block', textDecoration: 'none' }}>
                            {t('auth.forgot_password_link')}
                        </Link>
                    </div>

                    <button type="submit" className="btn-primary-pill mt-2">
                        {t('auth.login_btn')}
                    </button>
                </form>

                <div className="divider"><span>{t('auth.or')}</span></div>

                <Link to="/inscription" className="signup-link">
                    {t('auth.no_account')}
                </Link>
            </main>

        </div>
    );
}