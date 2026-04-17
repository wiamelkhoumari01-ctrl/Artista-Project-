import React, { useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function ForgotPassword() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await api.post('/api/forgot-password', { email });
            setMessage(t('forgot_password.success_msg'));
        } catch (err) {
            setError(t('forgot_password.error_msg'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <main className="login-card w-100" style={{ maxWidth: '450px' }}>
                <header className="text-center mb-4">
                    <h1 className="title" style={{ fontSize: '1.8rem' }}>{t('forgot_password.title')}</h1>
                    <p className="subtitle">{t('forgot_password.subtitle')}</p>
                </header>

                {message && <div className="alert alert-success p-2 small text-center rounded-pill">{message}</div>}
                {error && <div className="alert alert-danger p-2 small text-center rounded-pill">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label-custom">{t('forgot_password.email_label')}</label>
                        <input 
                            type="email" 
                            className="form-control-pill" 
                            placeholder={t('forgot_password.email_placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary-pill w-100" disabled={loading}>
                        {loading ? t('forgot_password.loading') : t('forgot_password.submit_btn')}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link to="/login" className="signup-link">{t('forgot_password.back_to_login')}</Link>
                </div>
            </main>
        </div>
    );
}