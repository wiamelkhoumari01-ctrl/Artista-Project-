import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import du context

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    // 1. On appelle la route Laravel avec les données (email, password)
    // Laravel recevra ça sur Route::post('/login', ...)
    const response = await axios.post('/api/login', {
      email: email,
      password: password
    });

    // 2. Si Laravel répond "success", on reçoit les infos ici
    navigate('/'); 
    
    // 3. Tu peux maintenant enregistrer l'utilisateur dans ton Context
    login(response.data.user); 
    
  } catch (error) {
    // Si Laravel renvoie une erreur (ex: 401 Identifiants incorrects)
    setError(error.response.data.message);
  }
  };

  return (
    <div className="login-container">
      <header className="header">
        <h1 className="title">Connexion</h1>
        <p className="subtitle">Heureux de vous revoir !</p>
      </header>

      <main className="login-card">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <Link to="/forgot-password" style={{ fontSize: '12px',color:'black' }}>Mot de passe oublié ?</Link>
          </div>

          <button type="submit" className="btn-primary">Se connecter</button>
        </form>

        <div className="divider"><span>ou</span></div>

        <Link to="/inscription" className="signup-link">Pas encore de compte ? S'inscrire</Link>
      </main>

      <footer className="footer-link-login">
        <Link to="/">← Retour à l'accueil</Link>
      </footer>
    </div>
  );
}