import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:8000/api/reset-password', {
                token: searchParams.get('token'),
                email: searchParams.get('email'),
                password: password,
                password_confirmation: passwordConfirmation
            });
            alert("Mot de passe modifié avec succès !");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card p-4 shadow-sm border-0 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="fw-bold mb-4 text-center">Nouveau mot de passe</h2>
                {error && <div className="alert alert-danger p-2 small">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Nouveau mot de passe</label>
                        <input 
                            type="password" 
                            className="form-control rounded-pill" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-bold">Confirmer le mot de passe</label>
                        <input 
                            type="password" 
                            className="form-control rounded-pill" 
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-dark w-100 rounded-pill py-2" disabled={loading}>
                        {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    );
}