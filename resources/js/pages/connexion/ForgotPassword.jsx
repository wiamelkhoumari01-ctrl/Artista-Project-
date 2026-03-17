import React, { useState } from 'react';
import axios from 'axios';

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
            const response = await axios.post('http://localhost:8000/api/forgot-password', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card p-4 shadow-sm border-0 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="fw-bold mb-3 text-center">Mot de passe oublié</h2>
                <p className="text-muted text-center small mb-4">
                    Entrez votre email pour recevoir un lien de réinitialisation.
                </p>

                {message && <div className="alert alert-success small">{message}</div>}
                {error && <div className="alert alert-danger small">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label small fw-bold">Email</label>
                        <input 
                            type="email" 
                            className="form-control rounded-pill" 
                            placeholder="exemple@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-dark w-100 rounded-pill py-2" disabled={loading}>
                        {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                    </button>
                </form>
            </div>
        </div>
    );
}