import React, { useState } from 'react';
import api from '../../api'; // Utilisation de l'instance configurée
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
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
            // Utilisation de api.post pour la cohérence
            const response = await api.post('/api/forgot-password', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <main className="login-card w-100" style={{ maxWidth: '450px' }}>
                <header className="text-center mb-4">
                    <h1 className="title" style={{ fontSize: '1.8rem' }}>Mot de passe oublié</h1>
                    <p className="subtitle">Entrez votre email pour recevoir un lien.</p>
                </header>

                {message && <div className="alert alert-success p-2 small text-center rounded-pill">{message}</div>}
                {error && <div className="alert alert-danger p-2 small text-center rounded-pill">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label-custom">Email</label>
                        <input 
                            type="email" 
                            className="form-control-pill" 
                            placeholder="exemple@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary-pill w-100" disabled={loading}>
                        {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link to="/login" className="signup-link">Retour à la connexion</Link>
                </div>
            </main>
        </div>
    );
}