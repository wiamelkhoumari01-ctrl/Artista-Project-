import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';


export default function Inscription() {
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const { handleAuthSuccess } = useAuth(); 
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '',
    password: '', password_confirmation: '', role: 'utilisateur' 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Changement : on utilise un objet pour stocker les erreurs par champ
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // On efface l'erreur du champ dès que l'utilisateur recommence à taper
    if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    try {
      const response = await api.post('/api/inscription', {
        ...formData,
        locale: locale 
      });

      if (response.data.success) {
        handleAuthSuccess(response.data.access_token, response.data.user);
        navigate(response.data.user.role === 'artiste' ? '/artist/dashboard' : '/');
      }
    } catch (error) {
      if (error.response?.status === 422) {
        // ✅ Mapping des erreurs Laravel (email, password, etc.)
        setErrors(error.response.data.errors);
      } else {
        setGeneralError("Une erreur est survenue lors de l'inscription.");
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const response = await api.post('/api/google-auth', {
            token: credentialResponse.credential,
            role: formData.role,
            locale: locale
        });

        if (response.data.success) {
            handleAuthSuccess(response.data.access_token, response.data.user);
            navigate(response.data.user.role === 'artiste' ? '/artist/dashboard' : '/');
        }
    } catch (error) {
        setGeneralError("L'authentification Google a échoué.");
    }
  };

  // Petit composant interne pour afficher l'erreur sous l'input
  const ErrorMsg = ({ field }) => (
    errors[field] ? <div className="text-danger ps-3 mt-1" style={{ fontSize: '12px', fontWeight: '500' }}>{errors[field][0]}</div> : null
  );

  return (
    <GoogleOAuthProvider clientId="10151565978892-2iitq14aqovmdk3vhu3816v7kojvfsap.apps.googleusercontent.com">
      <div className="login-container">
        <header className="header text-center mb-4">
          <h1 className="title">Inscription</h1>
          <p className="subtitle">Rejoignez la communauté ARTISTA.</p>
        </header>

        <main className="login-card">
          <div className="role-selection mb-4 d-flex justify-content-center gap-2">
            <button type="button" className={`btn-role ${formData.role === 'utilisateur' ? 'active' : ''}`} onClick={() => setFormData({...formData, role: 'utilisateur'})}>Utilisateur</button>
            <button type="button" className={`btn-role ${formData.role === 'artiste' ? 'active' : ''}`} onClick={() => setFormData({...formData, role: 'artiste'})}>Artiste</button>
          </div>

          {generalError && (
            <div className="alert alert-danger text-center mb-3" style={{ borderRadius: '20px', fontSize: '14px' }}>
              {generalError}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label-custom">Prénom</label>
                <input type="text" name="first_name" className={`form-control-pill ${errors.first_name ? 'is-invalid' : ''}`} value={formData.first_name} onChange={handleChange} required />
                <ErrorMsg field="first_name" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label-custom">Nom</label>
                <input type="text" name="last_name" className={`form-control-pill ${errors.last_name ? 'is-invalid' : ''}`} value={formData.last_name} onChange={handleChange} required />
                <ErrorMsg field="last_name" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label-custom">Email</label>
              <input type="email" name="email" className={`form-control-pill ${errors.email ? 'is-invalid' : ''}`} value={formData.email} onChange={handleChange} required />
              <ErrorMsg field="email" />
            </div>

            <div className="mb-3">
              <label className="form-label-custom">Mot de passe</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} name="password" className={`form-control-pill ${errors.password ? 'is-invalid' : ''}`} onChange={handleChange} required />
                <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <ErrorMsg field="password" />
            </div>

            <div className="mb-4">
              <label className="form-label-custom">Confirmer le mot de passe</label>
              <div className="password-wrapper">
                <input type={showConfirmPassword ? "text" : "password"} name="password_confirmation" className="form-control-pill" onChange={handleChange} required />
                <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary-pill">Créer mon compte</button>
          </form>

          <div className="divider"><span>ou</span></div>

          <div className="google-button-wrapper d-flex justify-content-center mb-3">
            <GoogleLogin onSuccess={handleGoogleSuccess} shape="pill" theme="outline" />
          </div>

          <div className="text-center mt-3">
             <Link to="/login" className="signup-link">Déjà inscrit ? Se connecter</Link>
          </div>
        </main>

        <footer className="footer-link-login mt-4">
          <Link to="/">← Retour à l'accueil</Link>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
}