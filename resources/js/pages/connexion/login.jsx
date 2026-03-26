import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';


export default function Login() {
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
                <h1 className="title">Connexion</h1>
                <p className="subtitle">Heureux de vous revoir !</p>
            </header>

            <main className="login-card">
                {error && <div className="alert-danger">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group mb-3" style={{ width: '100%', display: 'block' }}> {/* Ajout de mb-3 pour l'espacement */}
                    <label className="form-label-custom">Email</label>
                    <input 
                        type="email" 
                        className="form-control-pill"  /* Changé ici */
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div className="input-group mb-3">
                    <label className="form-label-custom">Mot de passe</label>
                    <div className="password-wrapper">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="form-control-pill" /* Changé ici */
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
                    {/* Lien mot de passe oublié aligné avec l'arrondi */}
                    <Link to="/forgot-password" style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginLeft: '15px', display: 'inline-block', textDecoration: 'none' }}>
                        Mot de passe oublié ?
                    </Link>
                </div>

                <button type="submit" className="btn-primary-pill mt-2"> {/* Utilise btn-primary-pill de l'inscription */}
                    Se connecter
                </button>
            </form>

                <div className="divider"><span>ou</span></div>

                <Link to="/inscription" className="signup-link">
                    Pas encore de compte ? S'inscrire
                </Link>
            </main>

            <footer className="footer-link-login">
                <Link to="/">← Retour à l'accueil</Link>
            </footer>
        </div>
    );
}