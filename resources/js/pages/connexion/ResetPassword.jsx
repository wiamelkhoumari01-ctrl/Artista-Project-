import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setGeneralError('');

        try {
            await api.post('/api/reset-password', {
                token: searchParams.get('token'),
                email: searchParams.get('email'),
                password: password,
                password_confirmation: passwordConfirmation
            });
            
            // On utilise une redirection propre
            navigate('/login?reset=success');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setGeneralError(err.response?.data?.message || "Le lien a expiré ou est invalide.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <main className="login-card w-100" style={{ maxWidth: '450px' }}>
                <header className="text-center mb-4">
                    <h1 className="title" style={{ fontSize: '1.8rem' }}>Nouveau mot de passe</h1>
                    <p className="subtitle">Sécurisez votre compte ARTISTA.</p>
                </header>

                {generalError && <div className="alert alert-danger p-2 small text-center rounded-pill">{generalError}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label-custom">Nouveau mot de passe</label>
                        <input 
                            type="password" 
                            className={`form-control-pill ${errors.password ? 'is-invalid' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        {errors.password && <div className="text-danger ps-3 small mt-1">{errors.password[0]}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="form-label-custom">Confirmer le mot de passe</label>
                        <input 
                            type="password" 
                            className="form-control-pill" 
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-primary-pill w-100" disabled={loading}>
                        {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
            </main>
        </div>
    );
}