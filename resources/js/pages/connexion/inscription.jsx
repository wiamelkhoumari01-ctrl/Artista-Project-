import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';

export default function Inscription() {
  const navigate = useNavigate();
  // On crée un objet pour stocker toutes les entrées du formulaire
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'utilisateur' // Par défaut
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Données prêtes pour Laravel :", formData);
    // Ici on appellera : await axios.post('/api/register', formData);
    // Puis : navigate('/dashboard');
  };

  return (
    <GoogleOAuthProvider clientId="VOTRE_CLIENT_ID_GOOGLE.apps.googleusercontent.com">
      <div className="login-container">
        <header className="header">
          <h1 className="title">Inscription</h1>
          <p className="subtitle">Rejoignez la communauté</p>
        </header>

        <main className="login-card">
          {/* Choix du rôle - TRÈS IMPORTANT pour ta BDD */}
          <div className="role-selection mb-4 d-flex justify-content-center gap-3">
             <button 
                type="button"
                className={`btn btn-sm ${formData.role === 'utilisateur' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setFormData({...formData, role: 'utilisateur'})}
             >Je suis un Visiteur</button>
             <button 
                type="button"
                className={`btn btn-sm ${formData.role === 'artiste' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setFormData({...formData, role: 'artiste'})}
             >Je suis un Artiste</button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 input-group">
                <label>Prénom</label>
                <input type="text" name="first_name" onChange={handleChange} required />
              </div>
              <div className="col-md-6 input-group">
                <label>Nom</label>
                <input type="text" name="last_name" onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <input type="password" name="password" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Confirmer le mot de passe</label>
              <input type="password" name="password_confirmation" onChange={handleChange} required />
            </div>

            <button type="submit" className="btn-primary mt-3">Créer mon compte</button>
          </form>

          <div className="divider"><span>ou</span></div>

          <div className="google-button-wrapper d-flex justify-content-center">
            <GoogleLogin onSuccess={(res) => console.log(res)} shape="pill" />
          </div>

          <Link to="/login" className="signup-link">Déjà inscrit ? Se connecter</Link>
        </main>

        <footer className="footer-link-login">
          <Link to="/">← Retour à l'accueil</Link>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
}